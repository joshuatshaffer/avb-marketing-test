import useSWR, { mutate } from "swr";
import axios from "axios";

export interface ContactResponsePaginatedDto {
  page: number;
  itemsPerPage: number;
  totalItems: number;
  contacts: ContactResponseDto[];
}

export interface ContactResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  emails: string[];
}

export interface ContactDto {
  firstName: string;
  lastName: string;
  emails: string[];
}

const apiRootUrl = "https://avb-contacts-api.herokuapp.com";

export async function addContact(contact: ContactDto) {
  const res = await axios.post<ContactResponseDto>(
    `${apiRootUrl}/contacts`,
    contact
  );

  mutate(`${apiRootUrl}/contacts/paginated`);

  return res;
}

export async function editContact({
  id: contactId,
  ...contact
}: ContactResponseDto) {
  const res = await axios.put<ContactResponseDto>(
    `${apiRootUrl}/contacts/${contactId}`,
    contact
  );

  mutate(`${apiRootUrl}/contacts/paginated`);

  return res;
}

export async function deleteContact({ id: contactId }: ContactResponseDto) {
  const res = await axios.delete<unknown>(
    `${apiRootUrl}/contacts/${contactId}`
  );

  mutate(`${apiRootUrl}/contacts/paginated`);

  return res;
}

export function useContactsPaginated() {
  const { data, error } = useSWR<ContactResponsePaginatedDto>(
    `${apiRootUrl}/contacts/paginated`,
    url => axios.get<ContactResponsePaginatedDto>(url).then(res => res.data)
  );

  return { data, error };
}
