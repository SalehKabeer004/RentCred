import { db } from './dbConnection.js';

async function fetchProperties() {
    let { data: properties, error } = await db
        .from('properties')
        .select('*')

    if (error) console.log("Error:", error)
    else {
        console.log(properties)
    }
}


fetchProperties()