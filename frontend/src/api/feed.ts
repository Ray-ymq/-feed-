import { postJson } from './client'
import type {
  FeedVideoItem,
  ListByFollowingResponse,
  ListByPopularityResponse,
  ListLatestResponse,
  ListLikesCountResponse,
} from './types'

function normalizeVideoList<T extends { video_list: FeedVideoItem[] | null | undefined }>(
  response: T,
): Omit<T, 'video_list'> & { video_list: FeedVideoItem[] } {
  return {
    ...response,
    video_list: Array.isArray(response.video_list) ? response.video_list : [],
  }
}

export async function listLatest(input: { limit: number; latest_time: number }) {
  const response = await postJson<ListLatestResponse>('/feed/listLatest', input)
  return normalizeVideoList(response)
}

export async function listLikesCount(input: { limit: number; likes_count_before?: number; id_before?: number }) {
  const body: Record<string, unknown> = { limit: input.limit }
  if (typeof input.likes_count_before === 'number' || typeof input.id_before === 'number') {
    body.likes_count_before = input.likes_count_before ?? 0
    body.id_before = input.id_before ?? 0
  }
  const response = await postJson<ListLikesCountResponse>('/feed/listLikesCount', body)
  return normalizeVideoList(response)
}

export async function listByPopularity(input: { limit: number; as_of: number; offset: number }) {
  const response = await postJson<ListByPopularityResponse>('/feed/listByPopularity', input)
  return normalizeVideoList(response)
}

export async function listByFollowing(input: { limit: number; latest_time: number }) {
  const response = await postJson<ListByFollowingResponse>('/feed/listByFollowing', input, { authRequired: true })
  return normalizeVideoList(response)
}
