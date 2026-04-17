"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaCloudUploadAlt, FaCheckCircle, FaUser, FaUserMd, FaMapMarkerAlt, FaPhone, FaEnvelope, FaEdit, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import locationsData from "@/lib/area.json";
import { getUserProfile, updateUserProfile } from "@/action/server/users";

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      contact: "",
      experience: "",
      division: "",
      district: "",
      area: "",
      address: "",
    },
  });

  const selectedDivision = watch("division");
  const selectedDistrict = watch("district");

  useEffect(() => {
    const fetchProfile = async () => {
      if (status !== "authenticated") return;
      const res = await getUserProfile(session.user.email);
      if (res.success) {
        setProfile(res.data);
        setImageUrl(res.data.image || "");
        reset({
          name: res.data.name || "",
          email: res.data.email || "",
          contact: res.data.contact || "",
          experience: res.data.experience || "",
          division: res.data.division || "",
          district: res.data.district || "",
          area: res.data.area || "",
          address: res.data.address || "",
        });
      }
    };

    fetchProfile();
  }, [session, status, reset]);

  // Cleanup preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const divisions = useMemo(
    () => (locationsData ? [...new Set(locationsData.map((l) => l.region))] : []),
    [],
  );

  const filteredDistricts = useMemo(
    () => locationsData.filter((l) => l.region === selectedDivision),
    [selectedDivision],
  );

  const filteredAreas = useMemo(() => {
    const districtObj = filteredDistricts.find((d) => d.district === selectedDistrict);
    return districtObj ? districtObj.covered_area : [];
  }, [selectedDistrict, filteredDistricts]);

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create preview URL
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    setSelectedFile(file);

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setImageUrl(data.url);
        setPreviewUrl(""); // Clear preview after successful upload
        setSelectedFile(null);
        // Clear the file input
        event.target.value = "";
        Swal.fire({
          icon: "success",
          title: "Image Uploaded!",
          text: "Your profile picture has been uploaded successfully.",
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Upload Failed",
          text: data.error || "Could not upload image.",
        });
        // Clear preview on error
        setPreviewUrl("");
        setSelectedFile(null);
        event.target.value = "";
      }
    } catch (error) {
      console.error('Upload error:', error);
      Swal.fire({
        icon: "error",
        title: "Upload Error",
        text: "Could not upload image. Please try again.",
      });
      // Clear preview on error
      setPreviewUrl("");
      setSelectedFile(null);
      event.target.value = "";
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }

    const payload = {
      ...data,
      image: imageUrl,
    };

    try {
      setUpdating(true);
      const res = await updateUserProfile(payload);
      if (res.success) {
        setProfile({ ...profile, ...payload });
        Swal.fire({
          icon: "success",
          title: "Profile Updated!",
          text: "Your profile has been updated successfully.",
          timer: 3000,
          showConfirmButton: false
        });
        setIsEditing(false);
        router.refresh();
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: res.message || "Could not update profile.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    reset({
      name: profile?.name || "",
      email: profile?.email || "",
      contact: profile?.contact || "",
      experience: profile?.experience || "",
      division: profile?.division || "",
      district: profile?.district || "",
      area: profile?.area || "",
      address: profile?.address || "",
    });
    setImageUrl(profile?.image || "");
    setPreviewUrl("");
    setSelectedFile(null);
    setIsEditing(false);
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center py-24">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  if (status !== "authenticated") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-xl font-bold text-slate-800">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {!isEditing ? (
        // Profile View Mode
        <div className="bg-gradient-to-br from-blue-50 dark:from-slate-800 to-indigo-100 dark:to-slate-700 rounded-3xl shadow-xl p-8">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                {imageUrl ? (
                  <img src={imageUrl} alt="profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-700">
                    <FaUserMd className="text-6xl" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-2 shadow-md">
                <FaCheckCircle className="text-sm" />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">{profile?.name || "User"}</h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">{session?.user?.role === "professional" ? "Healthcare Professional" : "User"}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary normal-case gap-2 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <FaEdit /> Edit Profile
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-3">
                <FaEnvelope className="text-blue-500 text-xl" />
                <h3 className="text-lg font-semibold text-slate-800">Email</h3>
              </div>
              <p className="text-slate-600">{profile?.email || "Not provided"}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-3">
                <FaPhone className="text-green-500 text-xl" />
                <h3 className="text-lg font-semibold text-slate-800">Phone</h3>
              </div>
              <p className="text-slate-600">{profile?.contact || "Not provided"}</p>
            </div>

            {session?.user?.role === "professional" && (
              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <FaUserMd className="text-purple-500 text-xl" />
                  <h3 className="text-lg font-semibold text-slate-800">Experience</h3>
                </div>
                <p className="text-slate-600">{profile?.experience || "Not provided"}</p>
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 md:col-span-2 lg:col-span-3">
              <div className="flex items-center gap-3 mb-3">
                <FaMapMarkerAlt className="text-red-500 text-xl" />
                <h3 className="text-lg font-semibold text-slate-800">Address</h3>
              </div>
              <p className="text-slate-600">
                {profile?.address || "Not provided"}
                {profile?.area && `, ${profile.area}`}
                {profile?.district && `, ${profile.district}`}
                {profile?.division && `, ${profile.division}`}
              </p>
            </div>
          </div>
        </div>
      ) : (

        
        // Edit Mode
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900">Edit Profile</h1>
              <p className="text-slate-500 mt-2">Update your personal details, profile image, and location information.</p>
            </div>
            <button
              onClick={handleCancel}
              className="btn btn-ghost normal-case gap-2"
            >
              <FaTimes /> Cancel
            </button>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-slate-200 bg-slate-100">
                {previewUrl ? (
                  <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                ) : imageUrl ? (
                  <img src={imageUrl} alt="profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <FaUserMd className="text-4xl" />
                  </div>
                )}
              </div>
              {uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-3xl flex items-center justify-center">
                  <span className="loading loading-spinner loading-sm text-white"></span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className={`btn btn-sm btn-outline gap-2 normal-case ${uploading ? 'loading' : ''}`}>
                <FaCloudUploadAlt />
                {uploading ? 'Uploading...' : 'Change Photo'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
              {previewUrl && (
                <p className="text-sm text-green-600 font-medium">
                  ✓ Preview - Click "Save Changes" to save
                </p>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  {...register("name", { required: true })}
                  className="input input-bordered w-full"
                />
                {errors.name && <span className="text-sm text-red-500">Name is required</span>}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input type="email" {...register("email")} className="input input-bordered w-full bg-slate-100" disabled />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Phone</span>
                </label>
                <input type="text" {...register("contact")} className="input input-bordered w-full" />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Experience</span>
                </label>
                <input type="text" {...register("experience")} className="input input-bordered w-full" />
              </div>
            </div>

            {session.user.role === "professional" && (
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Service Area</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Division</span>
                    </label>
                    <select {...register("division")} className="select select-bordered w-full">
                      <option value="">Select Division</option>
                      {divisions.map((division) => (
                        <option key={division} value={division}>{division}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">District</span>
                    </label>
                    <select {...register("district")} className="select select-bordered w-full" disabled={!selectedDivision}>
                      <option value="">Select District</option>
                      {filteredDistricts.map((district) => (
                        <option key={district.district} value={district.district}>{district.district}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Area</span>
                    </label>
                    <select {...register("area")} className="select select-bordered w-full" disabled={!selectedDistrict}>
                      <option value="">Select Area</option>
                      {filteredAreas.map((area) => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="form-control">
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <textarea {...register("address")} className="textarea textarea-bordered w-full" rows={4} />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-slate-500 text-sm">
                Last updated: {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : "Not set"}
                {imageUrl && (
                  <span className="block text-green-600 font-medium">
                    ✓ Profile image uploaded and ready to save
                  </span>
                )}
              </div>
              <button
                type="submit"
                className={`btn btn-primary normal-case ${updating ? 'loading' : ''}`}
                disabled={uploading || updating}
              >
                {updating ? 'Updating...' : <><FaCheckCircle className="mr-2" /> Save Changes</>}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
