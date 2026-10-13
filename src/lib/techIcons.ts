// Maps a skill/tech label to a local Simple Icons logo in /public/icons.
// Order matters (github before git, ubuntu before linux, exact "C" last).
const MAP: [RegExp, string][] = [
  [/^(ros|nav2|slam|urdf|rviz|tf\b|micro-ros|behavior)/i, "ros"],
  [/python/i, "python"],
  [/c\+\+/i, "cplusplus"],
  [/opencv/i, "opencv"],
  [/pytorch/i, "pytorch"],
  [/onnx/i, "onnx"],
  [/numpy/i, "numpy"],
  [/pandas/i, "pandas"],
  [/cuda/i, "nvidia"],
  [/docker/i, "docker"],
  [/ubuntu/i, "ubuntu"],
  [/linux/i, "linux"],
  [/github/i, "github"],
  [/^git$/i, "git"],
  [/arduino/i, "arduino"],
  [/raspberry/i, "raspberrypi"],
  [/esp32/i, "espressif"],
  [/figma/i, "figma"],
  [/javascript/i, "javascript"],
  [/html/i, "html5"],
  [/^css$/i, "css"],
  [/fusion 360/i, "autodesk"],
  [/solidworks/i, "dassaultsystemes"],
  [/^sql$/i, "mysql"],
  [/^c$/i, "c"],
];

export function techIcon(label: string): string | null {
  for (const [re, slug] of MAP) if (re.test(label.trim())) return `/icons/${slug}.svg`;
  return null;
}
