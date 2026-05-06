// ============================================================
// usePosts / usePostComments
// Comments are not in DataSource (frozen) — they're seeded statically
// and hold an in-memory extras list per session. Supabase swap point:
// move COMMENT_SEEDS to a Repository<Comment> and rebuild this hook.
// ============================================================

import { useCallback, useMemo, useState } from 'react';
import { getDataSource } from '@/data/source';
import { useRepository, type RepositoryView } from '@/data/hooks/useRepository';
import type { Post, Comment } from '@/data/seeds/types';
import { COMMENT_SEEDS } from '@/data/seeds';

export function usePosts(): RepositoryView<Post> {
  return useRepository(getDataSource().posts);
}

export interface PostCommentsView {
  comments: readonly Comment[];
  add: (body: string, author?: { name: string; avatar: string }) => void;
}

let _extrasCounter = 1;

export function usePostComments(
  postId: Comment['postId'] | undefined,
): PostCommentsView {
  const [extras, setExtras] = useState<Comment[]>([]);
  const seed = useMemo(
    () => (postId == null ? [] : COMMENT_SEEDS.filter((c) => c.postId === postId)),
    [postId],
  );
  const comments = useMemo(
    () => (postId == null ? [] : [...seed, ...extras.filter((c) => c.postId === postId)]),
    [seed, extras, postId],
  );
  const add = useCallback<PostCommentsView['add']>(
    (body, author = { name: '나비', avatar: '🦋' }) => {
      if (!postId) return;
      const c: Comment = {
        id: `c-extra-${_extrasCounter++}`,
        postId,
        author: author.name,
        avatar: author.avatar,
        body,
        time: '방금',
        likes: 0,
      };
      setExtras((arr) => [...arr, c]);
    },
    [postId],
  );
  return { comments, add };
}
