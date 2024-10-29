// lib/updateDisplayName.js
const { default: Supabase } = require("./supabaseClient");

export default async function updateDisplayName(userId, newDisplayName) {
  // Paso 1: Actualizar el displayName en la tabla UserProfiles
    const { data, error } = await Supabase
    .from('UserProfiles')
    .update({ display_name: newDisplayName })
    .eq('user_id', userId); // Asegúrate de que el usuario existe en UserProfiles

if (error) {
    console.error('Error updating displayName:', error);
    return { error };
}

const successMessage = 'Display name updated successfully';
  // Paso 2: Retornar el resultado
return { successMessage, data };
}