
import React, { useState, useEffect } from "react";
import axios from "axios";

const Project = () => {
  const [recentRepositories, setRecentRepositories] = useState([]);

  const fetchRecentRepositories = async () => {
    try {
      const response = await axios.get(
        "https://api.github.com/users/miicolas/repos?sort=pushed"
      );

      const recentRepos = response.data.slice(0, 5);

      const reposWithTopics = await Promise.all(
        recentRepos.map(async (repo) => {
          const topicsResponse = await axios.get(
            `https://api.github.com/repos/miicolas/${repo.name}/topics`
          );
          const commitsResponse = await axios.get(
            `https://api.github.com/repos/miicolas/${repo.name}/commits`
          );
          const contributorsResponse = await axios.get(
            `https://api.github.com/repos/miicolas/${repo.name}/contributors`
          );

          return {
            ...repo,
            topics: topicsResponse.data.names,
            lastUpdated: commitsResponse.data[0]?.commit?.author?.date || repo.updated_at,
            contributors: contributorsResponse.data,
          };
        })
      );

      setRecentRepositories(reposWithTopics);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRecentRepositories();
  }, []);

   return (
 <div className="h-full max-w-full bg-zinc-800 p-2 rounded-lg flex flex-col">  
     <div className="flex-1 bg-zinc-900 rounded-lg text-white">
         <div className="flex gap-2 p-6 text-zinc-400 h-max items-cente flex-col">
             <div className="flex gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                 </svg>
                 <p className="text-md">Project</p>
             </div>

             <div className="p-4">
             <div className="relative overflow-hidden max-h-96 ">
                 <div className="absolute top-0 left-0 h-5 bg-gradient-to-b right-0 from-zinc-900 to-transparent z-10"></div>
                 <div className="absolute bottom-0 left-0 h-5 bg-gradient-to-t right-0 from-zinc-900 to-transparent z-10"></div>
                 <div className=" px-6 pt-2  max-h-96 overflow-y-auto ">


         <ul className="text-white py-2 list-none">
           {recentRepositories.map((repo) => (

             <li
               className="py-3 px-2  text-gray-300 rounded-lg mb-2 bg-zinc-800"
               key={repo.id}
             >
             <div className="flex items-center gap-x-2">
                 <svg
                   className="w-[16px] h-[16px]text-white"
                   aria-hidden="true"
                   xmlns="http://www.w3.org/2000/svg"
                   fill="none"
                   viewBox="0 0 16 20"
                 >
                   <path
                     stroke="currentColor"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth="2"
                     d="M1 17V2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M5 15V1m8 18v-4"
                   />
                 </svg>
                 <div className="flex justify-between w-full items-center">
                   <a href={repo.html_url} className="hover:underline text-white">
                     <div>{repo.name}</div>
                   </a>
                 </div>
             </div>
             <p className="font-thin text-white">{repo.description}</p>
               {repo.topics && (
                 <ul className="mt-2">
                   {repo.topics.map((topic) => (
                     <li key={topic} className="inline-block pb-2">
                       <span className="text-white rounded-xl px-2 py-1 text-xs mr-2">
                         {topic}
                       </span>
                     </li>
                   ))}
                 </ul>
               )}
               {repo.contributors && (
                 <ul className="mt-2">
                  <div className="flex -space-x-4">
                    {repo.contributors.map((contributor) => (
                      
                      <li key={contributor.id} className="inline-block pb-2 hover:scale-105">
                        <a href={`https://github.com/${contributor.login}`} target="_blank" rel="noopener noreferrer">
                          <img
                            src={contributor.avatar_url}
                            alt={`Avatar of ${contributor.login}`}
                            className="w-8 h-8 rounded-full"
                          />
                          
                        </a>
                      </li>
                    ))}
                  </div>
                   
                 </ul>
               )}
                 <p className="text-gray-400 text-xs">
                 Last Updated:{" "}
                 {new Intl.DateTimeFormat("en-US", {
                   month: "short",
                   day: "2-digit",
                   hour: "2-digit",
                   minute: "2-digit",
                 }).format(new Date(repo.lastUpdated))}
               </p>




             </li>

           ))}

         </ul>
         </div>
             </div>

         </div>

     </div>
       </div>
       </div>


   );

  };

  export default Project;
