const { default: Supabase } = require("./supabaseClient");

export default async function updatePost(postId, updatedFields, tags) {
  const { data: { user }, error: authError } = await Supabase.auth.getUser();

  if (authError || !user) {
    console.error('Error fetching user:', authError);
    return { error: authError || 'User not authenticated' };
  }

  // Update post data
  const { data: post, error } = await Supabase
    .from('Posts')
    .update(updatedFields)
    .eq('post_id', postId)
    .eq('user_uuid', user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating post:", error);
    return { error: error.message || 'Failed to update post' };
  }

  // Step 1: Get current tags associated with the post
  const { data: currentTags, error: currentTagsError } = await Supabase
    .from('Post_tags')
    .select('tag_id')
    .eq('post_id', postId);

  if (currentTagsError) {
    console.error('Error fetching current tags:', currentTagsError);
    return { error: currentTagsError };
  }

  const currentTagIds = currentTags.map(tag => tag.tag_id);

  // Step 2: Get IDs for new tags, creating any new ones as necessary
  const newTagIds = [];
  for (const tagName of tags) {
    console.log("tagName to select")
    console.log(tagName)
    let { data: tag, error: tagError } = await Supabase
      .from('Tags')
      .select('id')
      .eq('tag_name', tagName)
      .single();

    if (tagError) {
      console.log('Error fetching tag:', tagError);
      return { error: tagError };
    }

    if (!tag) {
      const { data: newTag, error: newTagError } = await Supabase
        .from('Tags')
        .insert({ tag_name: tagName })
        .select()
        .single();

      if (newTagError) {
        console.log('Error creating tag:', newTagError);
        return { error: newTagError };
      }
      tag = newTag;
    }

    newTagIds.push(tag.id);
  }

  // Step 3: Determine tags to remove and add
  const tagsToAdd = newTagIds.filter(id => !currentTagIds.includes(id));
  const tagsToRemove = currentTagIds.filter(id => !newTagIds.includes(id));

  // Step 4: Remove tags that are no longer needed
  if (tagsToRemove.length > 0) {
    const { error: removeError } = await Supabase
      .from('Post_tags')
      .delete()
      .eq('post_id', postId)
      .in('tag_id', tagsToRemove);

    if (removeError) {
      console.error('Error removing tags:', removeError);
      return { error: removeError };
    }
  }

  // Step 5: Add new tags
  for (const tagId of tagsToAdd) {
    console.log(tagId)
    const { error: postTagError } = await Supabase
      .from('Post_tags')
      .insert({
        post_id: postId,
        tag_id: tagId
      });

    if (postTagError) {
      console.error('Error associating tag with post:', postTagError);
      return { error: postTagError };
    }
  }

  return { successMessage: 'Post updated successfully', data: post };
}
