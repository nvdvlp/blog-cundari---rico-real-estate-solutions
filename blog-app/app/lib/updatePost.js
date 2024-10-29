import { createClient } from '@supabase/supabase-js';

// Inicializa tu cliente Supabase
const Supabase = createClient('https://your-supabase-url', 'your-anon-key');

export default async function updatePost(postId, updatedFields, tags) {
  // Paso 1: Obtener el usuario autenticado
  const { data: { user }, error: authError } = await Supabase.auth.getUser();

  if (authError || !user) {
    console.error('Error fetching user:', authError);
    return { error: authError || 'User not authenticated' };
  }

  // Paso 2: Actualizar el post donde el user_uuid coincide con el ID del usuario autenticado
  const { data, error } = await Supabase
    .from('Posts')
    .update(updatedFields)
    .eq('post_id', postId)       // Asegúrate de actualizar el post correcto por ID
    .eq('user_uuid', user.id);   // Asegúrate de que el post pertenezca al usuario autenticado

  // Paso 3: Manejo de errores y retorno de resultados
  if (error) {
    console.error("Error updating post:", error);
    return { error: error.message || 'Failed to update post' }; // Mensaje de error más descriptivo
  }

  // Paso 4: Actualizar tags
  if (tags && Array.isArray(tags) && tags.length > 0) {
    // Limpiar tags antiguos
    const { error: deleteError } = await Supabase
      .from('PostTags')
      .delete()
      .eq('post_id', postId);

    if (deleteError) {
      console.error("Error deleting old tags:", deleteError);
      return { error: deleteError.message || 'Failed to delete old tags' };
    }

    // Insertar nuevos tags
    const tagInserts = tags.map(tag => ({
      post_id: postId,
      tag_id: tag.id // Asegúrate de que 'tag' tenga un 'id' válido
    }));

    const { error: tagError } = await Supabase
      .from('PostTags')
      .insert(tagInserts);

    if (tagError) {
      console.error("Error updating tags:", tagError);
      return { error: tagError.message || 'Failed to update tags' };
    }
  }

  // Mensaje de éxito
  return { successMessage: 'Post actualizado correctamente', data };
}
