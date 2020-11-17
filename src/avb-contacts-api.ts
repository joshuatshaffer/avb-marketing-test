import useSWR from "swr";
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

export function addContact(contact: ContactDto) {
  return axios.post<ContactResponseDto>(`${apiRootUrl}/contacts`, contact);
}

export function editContact({ id: contactId, ...contact }: ContactResponseDto) {
  return axios.put<ContactResponseDto>(
    `${apiRootUrl}/contacts/${contactId}`,
    contact
  );
}

export function deleteContact({ id: contactId }: ContactResponseDto) {
  return axios.delete<unknown>(`${apiRootUrl}/contacts/${contactId}`);
}

export function useContactsPaginated() {
  const { data, error } = useSWR<ContactResponsePaginatedDto>(
    `${apiRootUrl}/contacts/paginated`,
    url => axios.get<ContactResponsePaginatedDto>(url).then(res => res.data)
  );

  return { data, error };
}
