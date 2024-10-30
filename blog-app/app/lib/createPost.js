const { default: Supabase } = require("./supabaseClient");

export default async function createPost(post_title, post_desc, post_banner_img_b64, post_html, tags) {
  // Step 1: Get the authenticated user
  const { data: { user }, error: authError } = await Supabase.auth.getUser();

  if (authError || !user) {
    console.error('Error fetching user:', authError);
    return { error: authError };
  }

  // Step 2: Insert the post into the posts table, connected with user_uuid
  const { data: post, error: postError } = await Supabase
    .from('Posts')
    .insert([
      {
        post_title,
        post_desc,
        post_banner_img_b64,
        post_html,
        user_uuid: user.id,
      },
    ])
    .select()
    .single();

  if (postError) {
    console.log('Error to show the post:', postError);
    return { error: postError };
  }

  // Agregamos esta línea para depuración
  console.log('Inserted post:', post); 

  // Check if post.id is available
  if (!post.post_id) {
    console.error('Post ID is not available');
    return { error: 'Post ID is not available' };
  }
  
  // Step 3: Associate the post with the tags
  for (const tagName of tags) {
    // Check if the tag exists in the Tags table
    let { data: tag, error: tagError } = await Supabase
      .from('Tags')
      .select('id')
      .eq('tag_name', tagName)
      .single();

    if (tagError) {
      console.log('Error fetching tag:', tagError);
      return { error: tagError };
    }

    // If the tag doesn't exist, create it
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
      // Update the tag with the newly created ID
      tag = newTag;
    }

    // Associate the tag with the post in the post_tags table
    const { error: postTagError } = await Supabase
      .from('Post_tags')
      .insert({
        post_id: post.post_id,
        tag_id: tag.id
      });

    if (postTagError) {
      console.error('Error associating tag with post:', postTagError);
      return { error: postTagError };
    }
  }

  // If everything went well, return success message
  const successMessage = 'Successfully created post'; 
  return { successMessage };
}
