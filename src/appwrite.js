import { Client, Databases, ID, Query } from "appwrite"

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID


const client = new Client()
   .setEndpoint('https://fra.cloud.appwrite.io/v1')
   .setProject(PROJECT_ID)

const database = new Databases(client)
export const updateSearchCount = async (movie) => {
    try {
        const result = await database.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [Query.equal('movie_id', movie.id)]
          );
          

        if (result.documents.length > 0) {
            const doc = result.documents[0];
            await database.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                doc.$id,
                { count: doc.count + 1 }
            );
        } else {
            const doc = await database.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                {
                    title: movie.title,   // optional (for display)
                    movie_id: movie.id,   // used for queries
                    count: 1,
                    poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
                  }
                  
            );

            if (!doc.$id) {
                throw new Error('Failed to create document');
            }
        }
    } catch (error) {
        console.error('Error updating search count:', error);
    }
};


export const getTrending = async () => {
    try{
        const result = await database.listDocuments(DATABASE_ID,COLLECTION_ID,[Query.limit(5),Query.orderDesc('count')])
        return result.documents
    }catch(error){
        console.error('Error getting trending movies:', error);
    }
}