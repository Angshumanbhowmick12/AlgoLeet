import React, { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import UserAvatar from '../components/UserAvatar';
import { ShieldUser, User, User2Icon } from 'lucide-react';
import EditProfile from '../components/EditProfile';
import { usePlaylistStore } from '../store/usePlaylistStore';
// Import your Accordion components
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion'; 


const ProfilePage = () => {
    const { authUser, getUser } = useAuthStore();
    const { playlists, getAllPlaylists, isLoading: isPlaylistsLoading } = usePlaylistStore();

    useEffect(() => {
        if (!authUser) {
            getUser();
        }
    }, [authUser, getUser]);

    useEffect(() => {
        getAllPlaylists();
    }, [getAllPlaylists]);

    console.log("play", playlists);
    console.log("auth", authUser);

    if (!authUser) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg text-gray-500">Loading user data...</p>
            </div>
        );
    }

    return (
        <div className='from-background to-muted/50 border-border mdp-8 relative mb-2 rounded-2xl border bg-gradient-to-br w-screen h-screen'>
            <div className='from-background to-muted/50 border-border mdp-8 relative mb-2 overflow-hidden rounded-2xl border bg-gradient-to-br p-2 md:p-8'>
                <div className="bg-grid-white/[0.02] absolute inset-0 bg-[size:32px]" />
                <div className="relative flex items-center gap-8">
                    <div className='group relative'>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-50 blur-xl transition-opacity group-hover:opacity-75" />
                        <UserAvatar avatarUrl={authUser.data?.image} size={56} />
                        {
                            authUser.data?.role && authUser.data.role !== "ADMIN" ? (
                                <div className="absolute -top-2 -right-2 z-20 animate-pulse rounded-full bg-gradient-to-r from-purple-500 to-blue-600 p-2 shadow-lg">
                                    <User className="h-4 w-4 text-white" />
                                </div>
                            ) : (
                                <div className="absolute -top-2 -right-2 z-20 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-2 shadow-lg">
                                    <ShieldUser className="h-4 w-4 text-white" />
                                </div>
                            )
                        }
                    </div>
                    <div>
                        <div className="mb-2 flex items-center gap-3" >
                            <h3 className="text-2xl font-bold">{authUser.data?.name}</h3>
                            {authUser.data?.role === "ADMIN" ? (
                                <span className="rounded-full bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-400">
                                    Admin
                                </span>
                            ) : (
                                <span className="rounded-full bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-400">
                                   
                                    User
                                </span>
                            )}
                        </div>
                        <p className='text-muted-foreground flex items-center gap-2 text-xs'>
                            <User2Icon className='h-4 w-4' />
                            {authUser.data?.email}
                        </p>
                    </div>

                    <div className='ml-auto flex flex-wrap items-center justify-center gap-2 md:gap-3'>
                        {authUser.data && <EditProfile />}
                    </div>
                </div>
            </div>
            <div className='mt-5 p-2 md:p-8'>
                <h3 className="text-xl font-semibold mb-3">Your Playlists</h3>
                <div>
                    {isPlaylistsLoading ? (
                        <p className="text-gray-500">Loading playlists...</p>
                    ) : (
                        // --- CRITICAL FIX FOR playlists.map ERROR ---
                        // Ensure playlists is an array and has items before mapping
                        Array.isArray(playlists) && playlists.length > 0 ? (
                            // Outer map: Iterate over each playlist
                            <ul className="list-none p-0"> {/* Use ul for semantic list, remove default styling */}
                                {playlists.map((playlist) => (
                                    // Make sure AccordionTrigger value and AccordionItem value are unique strings
                                    <Accordion type="single" collapsible key={playlist.id}> 
                                        <AccordionItem value={playlist.id}> 

                                            <AccordionTrigger className="mb-2 p-2 border rounded-md">
                                                <h4 className="font-medium">{playlist.name}</h4> 
                                            </AccordionTrigger>

                                            <AccordionContent className="pl-4"> 
                                                {/* Check if playlist.problems exists and is an array before mapping */}
                                                {Array.isArray(playlist.problems) && playlist.problems.length > 0 ? (
                                                    <ul className="list-disc pl-5"> 
                                                        {/* Inner map: Iterate over the problems array specific to THIS playlist */}
                                                        {playlist.problems.map((problemItem) => (
                                                            // Ensure problemItem.id is used for key, and access nested problem details
                                                            <li key={problemItem.id} className="mb-1 text-sm text-gray-700">
                                                                {problemItem.problem?.title || 'Unknown Problem'} 
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-gray-500 text-sm">No problems in this playlist.</p>
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                ))}
                            </ul>
                        ) : (
                            // Display this if playlists is empty or not an array after loading
                            <p className="text-gray-500">No playlists found.</p>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;