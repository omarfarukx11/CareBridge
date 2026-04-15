"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaCloudUploadAlt, FaCheckCircle, FaUser, FaUserMd, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
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
    <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Profile Settings</h1>
          <p className="text-slate-500 mt-2">Update your personal details, profile image, and location information.</p>
        </div>
        <div className="flex items-center gap-4">
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
                ✓ Preview - Click "Update Profile" to save
              </p>
            )}
          </div>
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
  );
};

export default ProfilePage;
