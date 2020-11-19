import { mutate, useSWRInfinite } from "swr";
import axios from "axios";
import { useCallback } from "react";

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

const getKey = (
  pageIndex: number,
  previousPageData: ContactResponsePaginatedDto | null
) => {
  if (previousPageData && !previousPageData.contacts.length) {
    // reached the end
    return null;
  }

  return `${apiRootUrl}/contacts/paginated?page=${pageIndex + 1}`;
};

const fetcher = (url: string) =>
  axios.get<ContactResponsePaginatedDto>(url).then(res => res.data);

export function useContactsPaginated() {
  const { data, error, setSize } = useSWRInfinite<ContactResponsePaginatedDto>(
    getKey,
    fetcher
  );

  const onLoadMore = useCallback(() => {
    setSize(s => s + 1);
  }, [setSize]);

  return {
    contacts: data?.flatMap(d => d.contacts),
    error,
    hasNextPage: data ? data[data.length - 1].contacts.length > 0 : false,
    onLoadMore
  };
}
