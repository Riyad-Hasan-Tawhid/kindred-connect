import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Save } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import AvatarUpload from "@/components/profile/AvatarUpload";
 
 const Profile = () => {
   const navigate = useNavigate();
   const { user, loading: authLoading } = useAuth();
   const { profile, loading: profileLoading, updateProfile, refetch } = useProfile();
   const [isEditing, setIsEditing] = useState(false);
   const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
      first_name: "",
      last_name: "",
      birthday: "",
      gender: "",
      location: "",
      looking_for: "",
      bio: "",
      education_level: "",
      institute_name: "",
      division: "",
    });
 
   useEffect(() => {
     if (!authLoading && !user) {
       navigate("/login");
     }
   }, [user, authLoading, navigate]);
 
   useEffect(() => {
     if (profile) {
        setFormData({
          first_name: profile.first_name || "",
          last_name: profile.last_name || "",
          birthday: profile.birthday || "",
          gender: profile.gender || "",
          location: profile.location || "",
          looking_for: profile.looking_for || "",
          bio: profile.bio || "",
          education_level: (profile as any).education_level || "",
          institute_name: (profile as any).institute_name || "",
          division: (profile as any).division || "",
        });
     }
   }, [profile]);
 
   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
     setFormData({ ...formData, [e.target.name]: e.target.value });
   };
 
   const handleSave = async () => {
     setSaving(true);
     const { error } = await updateProfile(formData);
     setSaving(false);
     if (!error) {
       setIsEditing(false);
     }
   };
 
   if (authLoading || profileLoading) {
     return (
       <div className="min-h-screen bg-background flex items-center justify-center">
         <div className="animate-pulse text-muted-foreground">Loading...</div>
       </div>
     );
   }
 
   return (
     <div className="min-h-screen bg-background">
       <Navbar />
       
       <main className="pt-24 pb-12">
         <div className="container mx-auto px-4 max-w-2xl">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
           >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="mb-4">
                  <AvatarUpload
                    currentAvatarUrl={profile?.avatar_url || null}
                    onUploadComplete={(url) => {
                      // Profile is automatically updated in the component
                      // Just trigger a refetch to update the local state
                      refetch();
                    }}
                    size="lg"
                  />
                </div>
               <h1 className="font-display text-3xl font-bold mb-2">
                 {profile?.first_name || "Your"} {profile?.last_name || "Profile"}
               </h1>
               <p className="text-muted-foreground">{user?.email}</p>
             </div>
 
             {/* Profile Form */}
             <div className="bg-card rounded-2xl p-8 shadow-card border border-border/50">
               <div className="flex items-center justify-between mb-6">
                 <h2 className="font-semibold text-lg">Profile Information</h2>
                 <Button
                   variant={isEditing ? "hero" : "outline"}
                   size="sm"
                   onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                   disabled={saving}
                 >
                   {saving ? (
                     "Saving..."
                   ) : isEditing ? (
                     <>
                       <Save className="h-4 w-4 mr-2" />
                       Save
                     </>
                   ) : (
                     <>
                       <Edit2 className="h-4 w-4 mr-2" />
                       Edit
                     </>
                   )}
                 </Button>
               </div>
 
               <div className="space-y-5">
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="first_name">First Name</Label>
                     <Input
                       id="first_name"
                       name="first_name"
                       value={formData.first_name}
                       onChange={handleChange}
                       disabled={!isEditing}
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="last_name">Last Name</Label>
                     <Input
                       id="last_name"
                       name="last_name"
                       value={formData.last_name}
                       onChange={handleChange}
                       disabled={!isEditing}
                     />
                   </div>
                 </div>
 
                 <div className="space-y-2">
                   <Label htmlFor="birthday">Birthday</Label>
                   <Input
                     id="birthday"
                     name="birthday"
                     type="date"
                     value={formData.birthday}
                     onChange={handleChange}
                     disabled={!isEditing}
                   />
                 </div>
 
                 <div className="space-y-2">
                   <Label htmlFor="gender">Gender</Label>
                   <select
                     id="gender"
                     name="gender"
                     className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm disabled:opacity-50"
                     value={formData.gender}
                     onChange={handleChange}
                     disabled={!isEditing}
                   >
                     <option value="">Select...</option>
                     <option value="woman">Woman</option>
                     <option value="man">Man</option>
                     <option value="non-binary">Non-binary</option>
                     <option value="other">Other</option>
                   </select>
                 </div>
 
                 <div className="space-y-2">
                   <Label htmlFor="location">Location</Label>
                   <Input
                     id="location"
                     name="location"
                     placeholder="City, State"
                     value={formData.location}
                     onChange={handleChange}
                     disabled={!isEditing}
                   />
                 </div>
 
                  <div className="space-y-2">
                    <Label htmlFor="looking_for">Looking For</Label>
                    <select
                      id="looking_for"
                      name="looking_for"
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm disabled:opacity-50"
                      value={formData.looking_for}
                      onChange={handleChange}
                      disabled={!isEditing}
                    >
                      <option value="">Select...</option>
                      <option value="Casual Dating">Casual Dating</option>
                      <option value="Relationship">Relationship</option>
                      <option value="Friendship">Friendship</option>
                      <option value="Not Sure Yet">Not Sure Yet</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="education_level">Current Education Level</Label>
                    <select
                      id="education_level"
                      name="education_level"
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm disabled:opacity-50"
                      value={formData.education_level}
                      onChange={handleChange}
                      disabled={!isEditing}
                    >
                      <option value="">Select...</option>
                      <option value="School">School</option>
                      <option value="College">College</option>
                      <option value="University">University</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institute_name">Currently Studying At</Label>
                    <Input
                      id="institute_name"
                      name="institute_name"
                      placeholder="Institute name (optional)"
                      value={formData.institute_name}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="division">Division</Label>
                    <select
                      id="division"
                      name="division"
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm disabled:opacity-50"
                      value={formData.division}
                      onChange={handleChange}
                      disabled={!isEditing}
                    >
                      <option value="">Select...</option>
                      <option value="Dhaka">Dhaka</option>
                      <option value="Chattogram">Chattogram</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Barishal">Barishal</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Rangpur">Rangpur</option>
                      <option value="Mymensingh">Mymensingh</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                   <Textarea
                     id="bio"
                     name="bio"
                     placeholder="Tell others about yourself..."
                     value={formData.bio}
                     onChange={handleChange}
                     disabled={!isEditing}
                     rows={4}
                   />
                 </div>
               </div>
 
               {isEditing && (
                 <div className="mt-6 flex gap-3">
                   <Button
                     variant="outline"
                     className="flex-1"
                     onClick={() => {
                       setIsEditing(false);
                       if (profile) {
                          setFormData({
                            first_name: profile.first_name || "",
                            last_name: profile.last_name || "",
                            birthday: profile.birthday || "",
                            gender: profile.gender || "",
                            location: profile.location || "",
                            looking_for: profile.looking_for || "",
                            bio: profile.bio || "",
                            education_level: (profile as any).education_level || "",
                            institute_name: (profile as any).institute_name || "",
                            division: (profile as any).division || "",
                          });
                       }
                     }}
                   >
                     Cancel
                   </Button>
                   <Button
                     variant="hero"
                     className="flex-1"
                     onClick={handleSave}
                     disabled={saving}
                   >
                     {saving ? "Saving..." : "Save Changes"}
                   </Button>
                 </div>
               )}
             </div>
           </motion.div>
         </div>
       </main>
     </div>
   );
 };
 
 export default Profile;