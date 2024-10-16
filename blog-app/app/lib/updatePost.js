const { default: Supabase } = require("./supabaseClient");

export default async function updatePost(postId, updatedFields) {
  // Step 1: Get the authenticated user
  const { data: { user }, error: authError } = await Supabase.auth.getUser();

  if (authError || !user) {
    console.error('Error fetching user:', authError);
    return { error: authError || 'User not authenticated' };
  }

  // Step 2: Update the post where the user_uuid matches the logged-in user's ID
  const { data, error } = await Supabase
    .from('Posts')
    .update(updatedFields)
    .eq('post_id', postId)       // Ensure you're updating the correct post by ID
    .eq('user_uuid', user.id);  // Ensure the post belongs to the authenticated user

  const successMessage = 'Succesfull';
  // Step 3: Return the result, so you can handle the response
  return { successMessage, error };
}
