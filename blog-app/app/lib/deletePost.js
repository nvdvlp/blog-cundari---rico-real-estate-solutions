import Supabase from "./supabaseClient";

export default async function deletePost(postId) {
  // Step 1: Get the authenticated user
  const { data: { user }, error: authError } = await Supabase.auth.getUser();

  if (authError || !user) {
    console.error('Error fetching user:', authError);
    return { error: authError || 'User not authenticated' };
  }

  // Step 2: Delete the post where the user_uuid matches the logged-in user's ID
  const { data, error } = await Supabase
    .from('Posts')
    .delete()
    .eq('post_id', postId)          // Ensure you're deleting the correct post by its ID
    .eq('user_uuid', user.id); // Ensure the post belongs to the authenticated user

  // Step 3: Return the result for further handling
  const success = true;
  return { success, error };
}
