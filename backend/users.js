import supabase from "./database/client.js";

/*
    Pass userId as number
*/
export async function getUser(userId){
    const { data, error } = await supabase.from("user").select("*").eq("user_id", userId).limit(1);
    if (error) {
        throw new Error(`Error getting user: ${error.message}`);
    }
    return data[0];
}

export async function getUserByUsername(username){
    const { data, error } = await supabase.from("user").select("*").eq("username", username).limit(1);
    if (error || data.length === 0) {
        throw new Error(`Error getting user: ${error.message}`);
    }
    return data[0];
}

export async function createUser(username, password) {
    const {data, error} = await supabase.from("user").insert([{
        username: username,
        password: password
    }]).select("id");

    if (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }
    return data[0].id;
}

export async function getUserId(username) {
    const {data, error} = await supabase.from("user").select("id").eq("username", username);
    if (error) {
        throw new Error(`Error getting user Id: ${error.message}`);
    }
    return data[0];
}

