"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Combobox } from "@/components/ui/custom-combobox";
import Image from "next/image";
import { Trash2, Pencil, Plus } from "lucide-react";

const experiences = [
  { value: "all", label: "All" },
  { value: "Internship", label: "Internship" },
  { value: "Entry-Level Jobs", label: "Entry-Level Jobs" },
  { value: "Mid-Level Jobs", label: "Mid-Level Jobs" },
  { value: "Senior Jobs", label: "Senior Jobs" },
];

const locations = [
  { value: "all", label: "All" },
  { value: "India", label: "India" },
  { value: "USA", label: "USA" },
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "live", label: "Live" },
  { value: "expired", label: "Expired" },
  { value: "yet-to-come", label: "Yet To Come" },
];

const sortOptions = [
  { value: "latest", label: "Latest to Oldest" },
  { value: "oldest", label: "Oldest to Latest" },
];

function ExperienceFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <Combobox
      fieldLabel="Experience"
      value={value}
      onChange={onChange}
      options={experiences}
      placeholder="Experience"
      className="w-48"
    />
  );
}

function LocationFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <Combobox
      fieldLabel="Location"
      value={value}
      onChange={onChange}
      options={locations}
      placeholder="Location"
      className="w-48"
    />
  );
}

function StatusFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <Combobox
      fieldLabel="Status"
      value={value}
      onChange={onChange}
      options={statusOptions}
      placeholder="Status"
      className="w-48"
    />
  );
}

function SortFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <Combobox
      fieldLabel="Sort"
      value={value}
      onChange={onChange}
      options={sortOptions}
      placeholder="Sort"
      className="w-48"
    />
  );
}

const getFaviconUrl = (url: string) => {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    console.error("Invalid URL:", url);
    return "";
  }
};

export default function Careers() {
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingAdmin, setLoadingAdmin] = useState(true);
  const { toast } = useToast();

  const [positionName, setPositionName] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [description, setDescription] = useState("");
  const [jobLink, setJobLink] = useState("");
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [lastDate, setLastDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [jobs, setJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [filterExperience, setFilterExperience] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterStatus, setFilterStatus] = useState("live");
  const [sortOrder, setSortOrder] = useState("latest");

  useEffect(() => {
    const checkAdmin = async () => {
      if (session?.user?.email) {
        try {
          const res = await fetch(
            `/api/check-admin?email=${encodeURIComponent(session.user.email)}`
          );
          const data = await res.json();
          setIsAdmin(data.isAdmin);
        } catch {
          console.error("Error checking admin role");
        } finally {
          setLoadingAdmin(false);
        }
      } else {
        setLoadingAdmin(false);
      }
    };
    checkAdmin();
  }, [session?.user?.email]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoadingJobs(true);
      try {
        const res = await fetch("/api/careers");
        const data = await res.json();
        setJobs(data.careers);
      } catch {
        console.error("Error fetching jobs");
      }
      setLoadingJobs(false);
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs
    .filter((job) => {
      const experienceMatches =
        filterExperience === "all" || job.experience === filterExperience;
      const locationMatches =
        filterLocation === "all" ||
        job.location.toLowerCase().includes(filterLocation.toLowerCase());
      return experienceMatches && locationMatches;
    })
    .filter((job) => {
      if (filterStatus === "all") return true;
      const jobStart = new Date(job.startDate);
      const jobLast = new Date(job.lastDate);
      const today = new Date();
      if (filterStatus === "live") {
        return jobStart <= today && jobLast >= today;
      } else if (filterStatus === "expired") {
        return jobLast < today;
      } else if (filterStatus === "yet-to-come") {
        return jobStart > today;
      }
      return true;
    })
    .sort((a, b) => {
      const aDate = new Date(a.startDate);
      const bDate = new Date(b.startDate);
      return sortOrder === "latest"
        ? bDate.getTime() - aDate.getTime()
        : aDate.getTime() - bDate.getTime();
    });

  const resetForm = () => {
    setPositionName("");
    setCompany("");
    setLocation("");
    setExperience("");
    setDescription("");
    setJobLink("");
    setStartDate(() => {
      const today = new Date();
      return today.toISOString().split("T")[0];
    });
    setLastDate("");
  };

  type JobOpportunity = {
    id: string;
    positionName: string;
    company: string;
    location: string;
    experience: string;
    description: string;
    jobLink: string;
    startDate: string;
    lastDate: string;
  };

  const handleEditClick = (job: JobOpportunity) => {
    setCurrentEditId(job.id);
    setPositionName(job.positionName);
    setCompany(job.company);
    setLocation(job.location);
    setExperience(job.experience);
    setDescription(job.description);
    setJobLink(job.jobLink);
    setStartDate(job.startDate);
    setLastDate(job.lastDate);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newOpportunity = {
        positionName,
        company,
        location,
        experience,
        description,
        jobLink,
        startDate,
        lastDate,
      };
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOpportunity),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create opportunity");
      }
      toast({
        title: "Opportunity added",
        description: "Opportunity added successfully!",
      });

      resetForm();

      const fetchRes = await fetch("/api/careers");
      const fetchData = await fetchRes.json();
      setJobs(fetchData.careers);
    } catch {
      toast({
        title: "Error",
        description: "Error adding opportunity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentEditId) return;

    setIsUpdating(true);
    try {
      const updatedOpportunity = {
        id: currentEditId,
        positionName,
        company,
        location,
        experience,
        description,
        jobLink,
        startDate,
        lastDate,
      };

      const res = await fetch(`/api/careers`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedOpportunity),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update opportunity");
      }

      toast({
        title: "Opportunity updated",
        description: "Opportunity updated successfully!",
      });

      resetForm();
      setCurrentEditId(null);

      const fetchRes = await fetch("/api/careers");
      const fetchData = await fetchRes.json();
      setJobs(fetchData.careers);
    } catch {
      toast({
        title: "Error",
        description: "Error updating opportunity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/careers?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete opportunity");
      }
      toast({
        title: "Deleted",
        description: "Opportunity deleted successfully!",
      });

      const fetchRes = await fetch("/api/careers");
      const fetchData = await fetchRes.json();
      setJobs(fetchData.careers);
    } catch {
      toast({
        title: "Error",
        description: "Error deleting opportunity. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getTimeLeft = (lastDateStr: string) => {
    const last = new Date(lastDateStr);
    const now = new Date();
    const diffMs = last.getTime() - now.getTime();
    if (diffMs <= 0) return "Expired";
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return `${diffDays} days left`;
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <section className="flex flex-col items-center justify-center h-40 bg-muted dark:bg-[#20202a] text-center px-4">
        <p className="text-xl sm:text-4xl font-bold tracking-tight text-foreground">
          Apply for Your Dream Job
        </p>
        <p className="mt-2 text-muted-foreground text-sm sm:text-lg">
          Explore opportunities. Build your future. Start now.
        </p>
      </section>

      {/* Filters & Job Listings Section */}
      <section className="flex-1 px-6 pb-12 pt-8 max-w-7xl mx-auto w-full">
        {!loadingAdmin && isAdmin && (
          <div className="w-full flex justify-center mb-6">
            <div className="rounded-2xl bg-muted dark:bg-[#20202a] p-4 shadow-md border w-full sm:w-auto">
              <div className="flex items-center justify-between gap-4">
                <Label className="text-foreground font-semibold">
                  Admin Controls
                </Label>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      onClick={resetForm}
                      variant="default"
                      className="bg-primary hover:bg-primary/90 transition"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Opportunity
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Opportunity</DialogTitle>
                      <DialogDescription>
                      Fill out the form below to add a new job opportunity.
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      id="submitOpportunityForm"
                      onSubmit={handleSubmit}
                      className="space-y-4 px-1 pb-3 mt-2 max-h-96 overflow-y-auto"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="positionName">Position Name</Label>
                          <Input
                            id="positionName"
                            value={positionName}
                            onChange={(e) => setPositionName(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="company">Company</Label>
                          <Input
                            id="company"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="experience">Experience</Label>
                          <Select
                            value={experience}
                            onValueChange={setExperience}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select experience level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Internship">
                                Internship
                              </SelectItem>
                              <SelectItem value="Entry-Level Jobs">
                                Entry-Level
                              </SelectItem>
                              <SelectItem value="Mid-Level Jobs">
                                Mid-Level
                              </SelectItem>
                              <SelectItem value="Senior Jobs">
                                Senior
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={3}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="jobLink">Job Link</Label>
                        <Input
                          id="jobLink"
                          type="url"
                          value={jobLink}
                          onChange={(e) => setJobLink(e.target.value)}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="startDate">Start Date</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastDate">Last Date</Label>
                          <Input
                            id="lastDate"
                            type="date"
                            value={lastDate}
                            onChange={(e) => setLastDate(e.target.value)}
                          />
                        </div>
                      </div>
                    </form>
                    <DialogFooter>
                      <Button
                        form="submitOpportunityForm"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-4">
          <ExperienceFilter
            value={filterExperience}
            onChange={setFilterExperience}
          />
          <LocationFilter value={filterLocation} onChange={setFilterLocation} />
          <StatusFilter value={filterStatus} onChange={setFilterStatus} />
          <SortFilter value={sortOrder} onChange={setSortOrder} />
        </div>

        <div className="container mx-auto">
          {loadingJobs ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-1/4 mt-4" />
                </div>
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="mt-8 text-center text-muted-foreground">
              No job opportunities found.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="relative rounded-2xl border p-6 hover:bg-muted hover:dark:bg-[#20202a] transition group shadow-sm"
                >
                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            className="p-1 text-blue-500 hover:text-blue-700"
                            onClick={() => handleEditClick(job)}
                            title="Update Opportunity"
                          >
                            <Pencil size={16} />
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Update Opportunity</DialogTitle>
                            <DialogDescription>
                              Update the job opportunity details below.
                            </DialogDescription>
                          </DialogHeader>
                          <form
                            id="updateOpportunityForm"
                            onSubmit={handleUpdate}
                            className="space-y-4 px-1 pb-3 mt-2 max-h-96 overflow-y-auto"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="positionName">
                                  Position Name
                                </Label>
                                <Input
                                  id="positionName"
                                  value={positionName}
                                  onChange={(e) =>
                                    setPositionName(e.target.value)
                                  }
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="company">Company</Label>
                                <Input
                                  id="company"
                                  value={company}
                                  onChange={(e) => setCompany(e.target.value)}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="location">Location</Label>
                                <Input
                                  id="location"
                                  value={location}
                                  onChange={(e) => setLocation(e.target.value)}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="experience">Experience</Label>
                                <Select
                                  value={experience}
                                  onValueChange={setExperience}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select experience level" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Internship">
                                      Internship
                                    </SelectItem>
                                    <SelectItem value="Entry-Level Jobs">
                                      Entry-Level
                                    </SelectItem>
                                    <SelectItem value="Mid-Level Jobs">
                                      Mid-Level
                                    </SelectItem>
                                    <SelectItem value="Senior Jobs">
                                      Senior
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="jobLink">Job Link</Label>
                              <Input
                                id="jobLink"
                                type="url"
                                value={jobLink}
                                onChange={(e) => setJobLink(e.target.value)}
                                required
                              />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input
                                  id="startDate"
                                  type="date"
                                  value={startDate}
                                  onChange={(e) => setStartDate(e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor="lastDate">Last Date</Label>
                                <Input
                                  id="lastDate"
                                  type="date"
                                  value={lastDate}
                                  onChange={(e) => setLastDate(e.target.value)}
                                />
                              </div>
                            </div>
                          </form>
                          <DialogFooter>
                            <Button
                              form="updateOpportunityForm"
                              type="submit"
                              disabled={isUpdating}
                            >
                              {isUpdating ? "Updating..." : "Update"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 text-red-500 hover:text-red-700"
                            title="Delete Opportunity"
                          >
                            <Trash2 size={16} />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete Opportunity
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this opportunity?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(job.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}

                  <div
                    onClick={() => window.open(job.jobLink, "_blank")}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 mb-2 overflow-hidden">
                      <Image
                        src={getFaviconUrl(job.jobLink)}
                        alt=""
                        width={35}
                        height={35}
                        className="shrink-0 rounded-md"
                      />
                      <p className="text-sm text-muted-foreground truncate">
                        {job.company}
                      </p>
                    </div>

                    <h2 className="text-xl font-semibold line-clamp-2 mb-1">
                      {job.positionName}
                    </h2>

                    <p
                      className="text-sm text-muted-foreground line-clamp-3 h-[60px] mb-4"
                      title={job.description}
                    >
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{job.location}</Badge>
                      <Badge variant="secondary">
                        {getTimeLeft(job.lastDate)}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Toaster />
    </div>
  );
}
