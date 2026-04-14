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

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      Swal.fire("Upload Error", "Cloudinary is not configured.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      setUploading(true);
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.secure_url) {
        setImageUrl(data.secure_url);
        Swal.fire("Uploaded", "Profile image uploaded successfully.", "success");
      } else {
        Swal.fire("Upload Error", "Could not upload image.", "error");
      }
    } catch (error) {
      Swal.fire("Upload Error", "Could not upload image.", "error");
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

    const res = await updateUserProfile(payload);
    if (res.success) {
      Swal.fire("Success", "Profile updated successfully.", "success");
      setProfile({ ...profile, ...payload });
      router.refresh();
    } else {
      Swal.fire("Error", res.message || "Could not update profile.", "error");
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
          <div className="w-20 h-20 rounded-3xl overflow-hidden border border-slate-200 bg-slate-100">
            {imageUrl ? (
              <img src={imageUrl} alt="profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <FaUserMd className="text-3xl" />
              </div>
            )}
          </div>
          <label className="btn btn-sm btn-outline gap-2 normal-case">
            <FaCloudUploadAlt /> Change Photo
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
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
          <div className="text-slate-500 text-sm">Last updated: {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : "Not set"}</div>
          <button type="submit" className="btn btn-primary normal-case" disabled={uploading}>
            <FaCheckCircle className="mr-2" /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
