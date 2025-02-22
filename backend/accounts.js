import supabase from "./database/client";

/*
    Pass userId as number
 */
export async function getAccount(userId){
    const { data, error } = await supabase.from("accounts").select("*").eq("user_id", userId).limit(1);
    if (error) {
        return null;
    } else {
        return data[0];
    }
}