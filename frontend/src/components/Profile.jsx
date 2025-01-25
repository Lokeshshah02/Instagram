import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { FiAtSign, FiHeart, FiMessageCircle } from "react-icons/fi";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState("posts");
  const { userProfile } = useSelector((store) => store.auth);

  const isLoggedInUserProfile = true;
  const isFollowing = true;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedPost = activeTab === 'posts' ? userProfile?.posts :userProfile?.bookmarks

  return (
    <div className="flex max-w-5xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="profilephoto"
              />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span>{userProfile?.username}</span>
                {isLoggedInUserProfile ? (
                  <>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      Edit profile
                    </Button>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      View archieve
                    </Button>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      Ad tools
                    </Button>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button variant="secondary" className="h-8">
                      UnFollow
                    </Button>
                    <Button variant="secondary" className="h-8">
                      Message
                    </Button>
                  </>
                ) : (
                  <Button className="bg-[#0095F6] hover:bg-[#3192d2] h-8">
                    Follow
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <p>
                  <span className="font-semibold">
                    {userProfile?.posts.length}
                  </span>
                  <span>posts</span>
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.followers.length}
                  </span>
                  <span>followers</span>
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.following.length}
                  </span>
                  <span>following</span>
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">
                  {userProfile.bio || "bio..."}
                </span>
                <Badge className="w-fit" variant="secondary">
                  <FiAtSign />
                  {userProfile?.username}
                </Badge>
                <span>😁Learn Code</span>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("posts")}
            >
              POSTS
            </span>
            <span className={`py-3 cursor-pointer`}>REELS</span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "saved" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("saved")}
            >
              SAVED
            </span>
            <span className={`py-3 cursor-pointer`}>TAGS</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1">
        {
          displayedPost?.map((post) => {
            return(
              <div key={post?._id} className="relative group cursor-pointer">
                <img src={post.image} alt="post" className="rounded-sm my-2 w-full aspect-square object-cover"/>
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0
                group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center text-white space-x-4">
                   <Button className="flex items-center gap-2 hover:text-gray-300">
                    <FiHeart/>
                    <span>{post?.likes.length}</span>
                   </Button>
                   <Button className="flex items-center gap-2 hover:text-gray-300">
                    <FiMessageCircle/>
                    <span>{post?.comments.length}</span>
                   </Button>
                  </div>
                </div>
                </div>
            )
          })
        }
        </div>
      </div>
    </div>
  );
};

export default Profile;
