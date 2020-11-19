import { useSWRInfinite } from "swr";
import axios from "axios";
import { useEffect, useCallback } from "react";

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

const onContactMutateListeners = new Set<() => void>();

function emitContactMutationEvent() {
  for (let cb of onContactMutateListeners) {
    cb();
  }
}

export async function addContact(contact: ContactDto) {
  await axios.post<ContactResponseDto>(`${apiRootUrl}/contacts`, contact);

  emitContactMutationEvent();
}

export async function editContact({
  id: contactId,
  ...contact
}: ContactResponseDto) {
  await axios.put<ContactResponseDto>(
    `${apiRootUrl}/contacts/${contactId}`,
    contact
  );

  emitContactMutationEvent();
}

export async function deleteContact({ id: contactId }: ContactResponseDto) {
  await axios.delete<unknown>(`${apiRootUrl}/contacts/${contactId}`);

  emitContactMutationEvent();
}

function isLastPage({
  page,
  itemsPerPage,
  totalItems
}: ContactResponsePaginatedDto): boolean {
  return page * itemsPerPage >= totalItems;
}

const getKey = (
  pageIndex: number,
  previousPageData: ContactResponsePaginatedDto | null
) => {
  if (previousPageData && isLastPage(previousPageData)) {
    return null;
  }

  // swr indexes pages from 0, but the api indexes from 1.
  const page = pageIndex + 1;

  return `${apiRootUrl}/contacts/paginated?page=${page}`;
};

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export function useContactsPaginated() {
  const { data, error, setSize, mutate } = useSWRInfinite<
    ContactResponsePaginatedDto
  >(getKey, fetcher);

  const onLoadMore = useCallback(() => {
    setSize(s => s + 1);
  }, [setSize]);

  // When a contact is modified this list may need to refresh.
  useEffect(() => {
    function handelContactMutation() {
      mutate();
    }
    onContactMutateListeners.add(handelContactMutation);

    return () => {
      onContactMutateListeners.delete(handelContactMutation);
    };
  }, [mutate]);

  return {
    contacts: data?.flatMap(d => d.contacts),
    error,
    hasNextPage: data ? !isLastPage(data[data.length - 1]) : false,
    onLoadMore
  };
}
