const { default: Supabase } = require("./supabaseClient");

export default async function createPost(post_title, post_desc, post_banner_img_b64, post_html) {
  // Step 1: Get the authenticated user
  const { data: { user }, error: authError } = await Supabase.auth.getUser();

  if (authError || !user) {
    console.error('Error fetching user:', authError);
    return;
  }

  // Step 2: Insert the post into the posts table, connected with user_uuid
  const { data, error } = await Supabase
    .from('Posts')
    .insert([
      {
        post_title,
        post_desc,
        post_banner_img_b64,
        post_html,
        user_uuid: user.id,
      },
    ]);

  const successMessage = 'Succesfull' 
    
  return { successMessage, error };
}
