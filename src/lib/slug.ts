/** URL-safe id for hashes: "ROS 2 (Jazzy)" → "ros-2-jazzy", "C++" → "cplusplus". */
export const slug = (s: string) =>
  s.toLowerCase().replace(/\+/g, "plus").replace(/#/g, "sharp").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
