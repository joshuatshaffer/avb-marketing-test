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
  const res = await axios.post<ContactResponseDto>(
    `${apiRootUrl}/contacts`,
    contact
  );

  emitContactMutationEvent();

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

  emitContactMutationEvent();

  return res;
}

export async function deleteContact({ id: contactId }: ContactResponseDto) {
  const res = await axios.delete<unknown>(
    `${apiRootUrl}/contacts/${contactId}`
  );

  emitContactMutationEvent();

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
  const { data, error, setSize, mutate } = useSWRInfinite<
    ContactResponsePaginatedDto
  >(getKey, fetcher);

  const onLoadMore = useCallback(() => {
    setSize(s => s + 1);
  }, [setSize]);

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
    hasNextPage: data ? data[data.length - 1].contacts.length > 0 : false,
    onLoadMore
  };
}
