import React, { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import UserAvatar from "../components/UserAvatar";
import {
  ShieldUser,
  User,
  User2Icon,
  Flame,
  
  ListPlus,
  Check,
  X,
  Lightbulb
} from "lucide-react";
import EditProfile from "../components/EditProfile";
import { usePlaylistStore } from "../store/usePlaylistStore";
// Import your Accordion components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { Link } from "react-router-dom";
import { useSubmissionStore } from "../store/useSubmissionStore";
import { useProblemStore } from "../store/useProblemStore";
import ProgressChart from "../components/ui/ProgressChart";

import { calculateDailyStreak } from "../utils/calculateStreak";
import { getHeatmapData } from "../utils/getHeatmapData";
import {
  format,
  isWithinInterval,
  parseISO,
  subYears,
  formatDistanceToNow,
} from "date-fns";
import { Tooltip as ReactTooltip } from "react-tooltip";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

const ProfilePage = () => {
  const { authUser, getUser } = useAuthStore();
  const {
    playlists,
    getAllPlaylists,
    isLoading: isPlaylistsLoading,
  } = usePlaylistStore();
  const { getAllSubmission, submissions } = useSubmissionStore();
  const { getAllProblems, problems } = useProblemStore();

  useEffect(() => {
    if (!authUser) {
      getUser();
    }
    getAllSubmission();
    getAllProblems();
  }, [authUser, getUser, getAllSubmission, getAllProblems]);

  useEffect(() => {
    getAllPlaylists();
  }, [getAllPlaylists]);

  console.log("totalsub", submissions);

  console.log("play", playlists);
  console.log("auth", authUser);

  const totalAvailableProblems = problems.length;

  const uniqueSolvedProblemIds = new Set();

  const solvedProblemsByDifficulty = {
    easyProblems: 0,
    medProblems: 0,
    hardProblems: 0,
  };

  submissions.forEach((submission) => {
    if (submission.status === "Accepted" && submission.problem.id) {
      if (!uniqueSolvedProblemIds.has(submission.problem.id)) {
        uniqueSolvedProblemIds.add(submission.problem.id);

        const difficulty = submission.problem.difficulty;
        if (difficulty === "EASY") {
          solvedProblemsByDifficulty.easyProblems += 1;
        } else if (difficulty === "MEDIUM") {
          solvedProblemsByDifficulty.medProblems += 1;
        } else if (difficulty === "HARD") {
          solvedProblemsByDifficulty.hardProblems += 1;
        }
      }
    }
  });

  const progressData = {
    totalproblems: totalAvailableProblems,
    easyProblems: solvedProblemsByDifficulty.easyProblems,
    medProblems: solvedProblemsByDifficulty.medProblems,
    hardProblems: solvedProblemsByDifficulty.hardProblems,
    solvedProblems: uniqueSolvedProblemIds.size,
  };

  // console.log("Calculated progressData:", progressData);

  const streakData = calculateDailyStreak(submissions);
  // console.log("Streak Data:", streakData);

  const heatmapValues = getHeatmapData(submissions);
  const today = new Date();
  const endDate = today;
  const startDate = subYears(today, 1);

  let totalSubmissionsInYear = 0;
  let totalActiveDaysInYear = 0;

  heatmapValues.forEach((value) => {
    const date = parseISO(value.date);

    if (isWithinInterval(date, { start: startDate, end: endDate })) {
      totalSubmissionsInYear += value.count;
      if (value.count > 0) {
        totalActiveDaysInYear += 1;
      }
    }
  });

  const HeatmapColors = [
    "#2d2d2d", // Empty day background (Dark Grey)
    "#273722", // Level 1 (Lightest Green - subtle)
    "#3a5933", // Level 2
    "#558d4a", // Level 3
    "#74b761", // Level 4 (Brightest Green - most contributions)
  ];

  const allActivities = [];

  submissions.forEach((submission) => {
    allActivities.push({
      id: submission.id,
      type: "submission",
      createdAt: parseISO(submission.createdAt),
      status: submission.status,
      problemTitle: submission.problem?.title || "Unknown Problem",
      problemId: submission.problem?.id,
      language: submission.language,
    });
  });

  playlists.forEach((playlist) => {
    allActivities.push({
      id: playlist.id,
      type: "playlist-created",
      createdAt: parseISO(playlist.createdAt),
      playlistName: playlist.name,
    });
  });

  allActivities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const recentActivities = allActivities.slice(0, 10);

  if (!authUser) {
    return (
      <div className="flex justify-center items-center">
        <p className="text-lg text-gray-500">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="from-background to-muted/50 border-border mdp-8 relative mb-2 rounded-2xl border bg-transparent w-full">
      <div className="from-background to-muted/50 border-border mdp-8 relative mb-2 overflow-hidden rounded-2xl border bg-gradient-to-br p-2 md:p-8">
        <div className="bg-grid-white/[0.02] absolute inset-0 bg-[size:32px]" />
        <div className="relative flex items-center gap-8">
          <div className="group relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-50 blur-xl transition-opacity group-hover:opacity-75" />
            <UserAvatar avatarUrl={authUser.data?.image} size={56} />
            {authUser.data?.role && authUser.data.role !== "ADMIN" ? (
              <div className="absolute -top-2 -right-2 z-20 animate-pulse rounded-full bg-gradient-to-r from-purple-500 to-blue-600 p-2 shadow-lg">
                <User className="h-4 w-4 text-white" />
              </div>
            ) : (
              <div className="absolute -top-2 -right-2 z-20 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-2 shadow-lg">
                <ShieldUser className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
          <div>
            <div className="mb-2 flex items-center gap-3">
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
            <p className="text-muted-foreground flex items-center gap-2 text-xs">
              <User2Icon className="h-4 w-4" />
              {authUser.data?.email}
            </p>
          </div>

          <div className="ml-auto flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {authUser.data && <EditProfile />}
          </div>
        </div>
      </div>

      <div className="mt-5 p-2 md:p-8">
                <div className="flex flex-col md:flex-row gap-4">

                    {/* Daily Streak Section - Theme-Aware Design */}
                    <div className="relative flex-1 group rounded-lg bg-card p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-lg border border-border">
                    

                        <h3 className="relative z-10 mb-5 text-xl font-semibold text-foreground">Your Streak</h3>

                        <div className="relative z-10 flex flex-col items-start md:flex-row md:items-center md:justify-between">
                            {/* Current Streak Number Display */}
                            <div className="flex items-center gap-3 text-primary"> {/* Changed to text-primary */}
                                <Flame className="h-8 w-8 flex-shrink-0  animate-pulse text-amber-600 fill-amber-600 shadow-amber-400 " />
                                <div>
                                    <span className="text-4xl font-extrabold leading-none">
                                        {streakData.currentStreak}
                                    </span>
                                    <span className="ml-2 text-xl font-medium text-muted-foreground">Days</span> {/* Changed to text-muted-foreground */}
                                </div>
                            </div>

                            {/* Status Indicator (Solved Today / Solve Today) */}
                            <div className="mt-4 md:mt-0 md:ml-auto">
                                {streakData.isTodaySolved ? (
                                    <div className="inline-flex items-center rounded-full bg-success/10 px-4 py-2 text-success text-sm font-semibold transition-colors duration-200 hover:bg-success/20">
                                        <Check className="mr-2 h-4 w-4" />
                                        Solved Today! 🎉
                                    </div>
                                ) : (
                                    <div className="inline-flex items-center rounded-full bg-destructive/10 px-4 py-2 text-destructive text-sm font-semibold transition-colors duration-200 hover:bg-destructive/20">
                                        <Lightbulb className="mr-2 h-4 w-4" />
                                        Solve today! ⏳
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Longest Streak*/}
                        {streakData.longestStreak > 0 && (
                            <p className="relative z-10 mt-6 text-sm text-muted-foreground">
                                Your longest streak: <span className="font-semibold text-foreground">{streakData.longestStreak} days</span>
                            </p>
                        )}
                    </div> 

                    {/* Progress Chart Section */}
                    <div className="flex-1 group rounded-lg bg-card p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-lg border border-border">
                        <h3 className="text-xl font-semibold mb-3 text-foreground">Your Progress</h3>
                        <ProgressChart progressData={progressData} />
                    </div> 

                </div>
            </div>
      {/* {Contributions Heatmap Section} */}
      <div className="mt-5 p-2 md:p-8 border-t border-muted-foreground/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between text-sm text-gray-400 mb-4">
          <div className="flex items-center space-x-2 mb-2 md:mb-0">
            <span className="font-semibold text-white">
              {totalSubmissionsInYear}
            </span>
            <span>submissions in the past one year</span>
            <span
              className="text-gray-500"
              data-tooltip-id="submissions-tooltip"
              data-tooltip-content="Total number of accepted submission in the last 365 days."
            >
              ⓘ
            </span>
            <ReactTooltip id="submissions-tooltip" />
          </div>
          <div className="flex items-center space-x-4">
            <span>
              Total active days:{" "}
              <span className="font-semibold text-white">
                {totalActiveDaysInYear}
              </span>
            </span>
            <span>
              Max streak :{" "}
              <span className="font-semibold text-white">
                {streakData.longestStreak}
              </span>
            </span>
            <button className="flex items-center px-3 py-1 text-xs bg-neutral-700 hover:bg-neutral-600 rounded-md">
              Current <User className="h-3 w-3 ml-1" />
            </button>
          </div>
        </div>

        <div className="overflow-x-hidden pb-4 ">
          <CalendarHeatmap
            startDate={startDate}
            endDate={endDate}
            values={heatmapValues}
            colors={HeatmapColors}
            classForValue={(value) => {
              if (!value) {
                return "color-empty";
              }
              return `color-scale-${Math.min(4, Math.max(1, value.count))}`;
            }}
            tooltipDataAttrsGenerator={(value) => {
              // Use a consistent ID for your heatmap tooltips
              const tooltipId = "heatmap-calendar-tooltip"; // Choose a descriptive ID

              if (!value || !value.date) {
                return {
                  "data-tooltip-id": tooltipId, // Link to the ReactTooltip component
                  "data-tooltip-content": "No contributions",
                };
              }
              return {
                "data-tooltip-id": tooltipId, // Link to the ReactTooltip component
                "data-tooltip-content": `${format(
                  parseISO(value.date),
                  "MMM d,yyyy"
                )}: ${value.count || 0} contribution${
                  value.count === 1 ? "" : "s"
                }`,
              };
            }}
            showWeekdayLabels={true}
            gutterSize={5}
            horizontal={true}
            showMonthLabels={true}
          />

          <ReactTooltip id="heatmap-calendar-tooltip" />
        </div>
      </div>

      {/* playlist */}
      <div className="mt-5 p-2 bg-background md:p-8">
        <h3 className="text-xl font-semibold mb-3">Your Playlists</h3>
        <div>
          {isPlaylistsLoading ? (
            <p className="text-gray-500">Loading playlists...</p>
          ) : // Ensure playlists is an array and has items before mapping
          Array.isArray(playlists) && playlists.length > 0 ? (
            <ul className="list-none p-0">
              {" "}
              {/* Use ul for semantic list, remove default styling */}
              {playlists.map((playlist) => (
                // Make sure AccordionTrigger value and AccordionItem value are unique strings
                <Accordion type="single" collapsible key={playlist.id}>
                  <AccordionItem value={playlist.id}>
                    <AccordionTrigger className="mb-2 p-2 border rounded-md">
                      <h4 className="font-medium">{playlist.name}</h4>
                    </AccordionTrigger>

                    <AccordionContent className="pl-4">
                      {/* Check if playlist.problems exists and is an array before mapping */}
                      {Array.isArray(playlist.problems) &&
                      playlist.problems.length > 0 ? (
                        <ul className="list-disc pl-5">
                          {/* Inner map: Iterate over the problems array specific to THIS playlist */}
                          {playlist.problems.map((problemItem) => (
                            <li
                              key={problemItem.id}
                              className="mb-1 text-sm text-gray-700"
                            >
                              <Link to={`/problem/${problemItem.problem.id}`}>
                                {problemItem.problem?.title ||
                                  "Unknown Problem"}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-sm">
                          No problems in this playlist.
                        </p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </ul>
          ) : (
            // Display this if playlists is empty or not an array after loading
            <p className="text-gray-500">No playlists found.</p>
          )}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-5 p-2 md:p-8 border-t border-muted-foreground/10">
        <h3 className="text-xl font-semibold mb-3">Recent Activity</h3>
        {recentActivities.length > 0 ? (
          <ul className="space-y-4">
            {recentActivities.map((activity) => (
              <li
                key={activity.id}
                className="flex items-start space-x-3 bg-neutral-900 p-4 rounded-lg shadow-md"
              >
                <div className="flex-shrink-0 mt-1">
                  {activity.type === "submission" &&
                    (activity.status === "Accepted" ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    ))}
                  {activity.type === "playlist-created" && (
                    <ListPlus className="w-5 h-5 text-blue-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium leading-tight">
                    {activity.type === "submission" && (
                      <>
                        {activity.status === "Accepted"
                          ? "Accepted"
                          : activity.status}{" "}
                        <Link
                          to={`/problem/${activity.problemId}`}
                          className="text-blue-400 hover:underline"
                        >
                          "{activity.problemTitle}"
                        </Link>{" "}
                        ({activity.language})
                      </>
                    )}
                    {activity.type === "playlist-created" && (
                      <>
                        Created new playlist{" "}
                        <span className="text-blue-400">
                          "{activity.playlistName}"
                        </span>
                      </>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(activity.createdAt, {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No recent activity.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
