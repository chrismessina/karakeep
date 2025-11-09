import { useCachedPromise } from "@raycast/utils";
import { fetchGetAllBookmarks } from "../apis";
import { ApiResponse, Bookmark, GetBookmarksParams } from "../types";

/**
 * Simplified hook using Raycast's native pagination support.
 * This eliminates ~70 lines of manual state management.
 */
export function useGetAllBookmarks({ favourited, archived }: GetBookmarksParams = {}) {
  const { isLoading, data, error, revalidate, pagination } = useCachedPromise(
    (favourited, archived) => async (options) => {
      const result = (await fetchGetAllBookmarks({
        cursor: options.cursor,
        favourited,
        archived,
      })) as ApiResponse<Bookmark>;

      return {
        data: result.bookmarks || [],
        hasMore: result.nextCursor !== null,
        cursor: result.nextCursor,
      };
    },
    [favourited, archived],
    {
      keepPreviousData: true,
      initialData: [],
    },
  );

  return {
    isLoading,
    bookmarks: data || [],
    hasMore: pagination?.hasMore ?? false,
    error,
    revalidate,
    pagination, // Pass this directly to <List pagination={pagination} />
  };
}
