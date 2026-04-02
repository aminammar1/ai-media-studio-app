"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Image as ImageIcon,
  Loader2,
  Pencil,
  Play,
  Upload,
  Video,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/* ── Types ── */

type TabName = "image" | "edit" | "video";

type StylePreset = {
  key: "women" | "anime" | "men";
  title: string;
  label: string;
  prompt: string;
  summary: string;
  image: string;
  tags: [string, string, string];
};

const DEFAULT_PROMPT =
  "Luxury editorial portrait, sculpted window light, cinematic contrast, premium fashion texture";

const STYLE_PRESETS: StylePreset[] = [
  {
    key: "women",
    title: "Women Authentic",
    label: "Leather & Edge",
    prompt:
      "Gorgeous woman in black leather jacket, round glasses, dark lipstick, alluring confident gaze, moody studio light, editorial portrait",
    summary:
      "Black leather, round glasses, dark editorial confidence with a nerdy edge.",
    image: "/women-editorial.png",
    tags: ["leather", "editorial", "authentic"],
  },
  {
    key: "anime",
    title: "Anime",
    label: "Dark Warrior",
    prompt:
      "Dark brooding anime warrior, spiky dark hair, intense red eyes, dark cloak, dramatic lightning background, detailed anime art, cel-shaded",
    summary:
      "Sasuke-style intensity with lightning-charged atmosphere and sharp anime linework.",
    image: "/kpop-girl.png",
    tags: ["anime", "dark energy", "cinematic"],
  },
  {
    key: "men",
    title: "Menswear",
    label: "Tailored Shadow",
    prompt:
      "Mens fashion campaign portrait, tailored coat, graphite backdrop, cold rim light, luxury editorial framing",
    summary:
      "Sharp tailoring, graphite tones, and controlled contrast for a campaign image.",
    image: "/men-fashion.png",
    tags: ["tailored", "campaign", "graphite"],
  },
];

const TAB_ITEMS: { value: TabName; label: string; icon: React.ElementType }[] = [
  { value: "image", label: "Generate", icon: ImageIcon },
  { value: "edit", label: "Edit", icon: Pencil },
  { value: "video", label: "Video", icon: Video },
];

/* ── Helpers ── */

function isLikelyVideo(url: string): boolean {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url);
}

function pullUrl(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const maybeUrl = (payload as { url?: unknown }).url;
  return typeof maybeUrl === "string" ? maybeUrl : null;
}

function pullError(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;
  const maybeError = (payload as { error?: unknown }).error;
  return typeof maybeError === "string" ? maybeError : fallback;
}

function downloadAsset(url: string, filename: string): void {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/* ── Preset thumbnail ── */

function PresetThumbnail({
  preset,
  isActive,
  onSelect,
}: {
  preset: StylePreset;
  isActive: boolean;
  onSelect: (p: StylePreset) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(preset)}
      className={`group relative overflow-hidden rounded-2xl border text-left transition-all duration-300 ${
        isActive
          ? "border-white/20 bg-white/[0.08]"
          : "border-white/[0.06] bg-white/[0.02] hover:border-white/12 hover:bg-white/[0.05]"
      }`}
    >
      <div className="flex items-center gap-3 p-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
          <Image src={preset.image} alt={preset.title} fill sizes="48px" className="object-cover grayscale" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[0.6rem] uppercase tracking-[0.3em] font-medium text-white/40">{preset.label}</p>
          <p className="mt-0.5 text-sm font-medium text-white truncate">{preset.title}</p>
        </div>
        {isActive && (
          <div className="shrink-0 rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[0.55rem] uppercase tracking-widest font-medium text-white/60">Active</div>
        )}
      </div>
    </button>
  );
}

/* ── Output Frame ── */

function OutputFrame({ src, loading, emptyLabel, mode }: { src: string; loading: boolean; emptyLabel: string; mode: TabName }) {
  const hasOutput = Boolean(src);
  const renderVideo = hasOutput && isLikelyVideo(src);

  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-white/[0.06] bg-[#050505]">
      <div className="relative aspect-[4/5] sm:aspect-[16/10]">
        <AnimatePresence mode="wait">
          {!hasOutput && !loading && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full w-full items-center justify-center px-8 text-center">
              <div className="max-w-xs space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] text-white/25">
                  {mode === "video" ? <Video className="h-6 w-6" /> : <ImageIcon className="h-6 w-6" />}
                </div>
                <p className="text-sm text-white/25">{emptyLabel}</p>
              </div>
            </motion.div>
          )}
          {hasOutput && !renderVideo && (
            <motion.img key="img" src={src} alt="Output" initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="h-full w-full object-contain p-2" />
          )}
          {hasOutput && renderVideo && (
            <motion.div key="vid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full w-full">
              <video src={src} controls className="h-full w-full object-cover" />
            </motion.div>
          )}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md">
            <div className="flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.06] px-5 py-2.5 text-white">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs font-semibold tracking-[0.3em] uppercase">Processing</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ── Main Studio Panel ── */

export function StudioPanel() {
  const [prompt, setPrompt] = React.useState(DEFAULT_PROMPT);
  const [status, setStatus] = React.useState("Ready to compose");
  const [imageUrl, setImageUrl] = React.useState("");
  const [videoUrl, setVideoUrl] = React.useState("");
  const [editUrl, setEditUrl] = React.useState("");
  const [sourceImage, setSourceImage] = React.useState<File | null>(null);
  const [editSourceImage, setEditSourceImage] = React.useState<File | null>(null);
  const [activeTab, setActiveTab] = React.useState<TabName>("image");
  const [loadingMode, setLoadingMode] = React.useState<TabName | null>(null);
  const [selectedPresetKey, setSelectedPresetKey] = React.useState<StylePreset["key"] | null>(null);

  const selectedPreset = selectedPresetKey ? STYLE_PRESETS.find((p) => p.key === selectedPresetKey) ?? null : null;
  const modeLabels: Record<TabName, string> = { image: "Generate", edit: "Edit", video: "Video" };

  function applyPreset(preset: StylePreset) {
    setPrompt(preset.prompt);
    setSelectedPresetKey(preset.key);
    setActiveTab("image");
    setStatus(`${preset.title} preset loaded`);
  }

  async function submitImageGeneration(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!prompt.trim()) { setStatus("Write a prompt first"); return; }
    setLoadingMode("image");
    setStatus("Generating image...");
    try {
      const res = await fetch("/api/image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
      const payload: unknown = await res.json().catch(() => null);
      if (!res.ok) { setStatus(pullError(payload, "Image generation failed")); return; }
      const url = pullUrl(payload);
      if (!url) { setStatus("No URL returned"); return; }
      setImageUrl(url);
      setStatus("Image ready");
    } catch { setStatus("Network error"); } finally { setLoadingMode(null); }
  }

  async function submitImageEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!prompt.trim()) { setStatus("Write an edit prompt first"); return; }
    if (!editSourceImage) { setStatus("Upload a source image to edit"); return; }
    setLoadingMode("edit");
    setStatus("Editing image...");
    try {
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("image", editSourceImage);
      const res = await fetch("/api/edit", { method: "POST", body: formData });
      const payload: unknown = await res.json().catch(() => null);
      if (!res.ok) { setStatus(pullError(payload, "Image edit failed")); return; }
      const url = pullUrl(payload);
      if (!url) { setStatus("No URL returned"); return; }
      setEditUrl(url);
      setStatus("Edit ready");
    } catch { setStatus("Network error"); } finally { setLoadingMode(null); }
  }

  async function submitVideoGeneration(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!prompt.trim()) { setStatus("Write a prompt first"); return; }
    if (!sourceImage) { setStatus("Upload a start image first"); return; }
    setLoadingMode("video");
    setStatus("Generating video...");
    try {
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("firstFrameImage", sourceImage);
      const res = await fetch("/api/video", { method: "POST", body: formData });
      const payload: unknown = await res.json().catch(() => null);
      if (!res.ok) { setStatus(pullError(payload, "Video generation failed")); return; }
      const url = pullUrl(payload);
      if (!url) { setStatus("No URL returned"); return; }
      setVideoUrl(url);
      setStatus("Video ready");
    } catch { setStatus("Network error"); } finally { setLoadingMode(null); }
  }

  const currentOutput = activeTab === "image" ? imageUrl : activeTab === "edit" ? editUrl : videoUrl;

  return (
    <main className="relative min-h-screen text-white">
      <div className="noise-overlay" />

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="float-slow absolute -left-24 top-16 h-72 w-72 rounded-full bg-white/[0.03] blur-[100px]" />
        <div className="float-fast absolute right-[-7rem] top-1/4 h-96 w-96 rounded-full bg-white/[0.02] blur-[100px]" />
      </div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 border-b border-white/[0.05] bg-black/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-4">
            {/* Back button — clean, minimal, same UI language */}
            <Link href="/" className="group flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] transition-all hover:border-white/15 hover:bg-white/[0.06]">
              <ArrowLeft className="h-4 w-4 text-white/50 transition-colors group-hover:text-white" />
            </Link>
            <div className="h-5 w-px bg-white/[0.06]" />
            <div>
              <p className="text-[0.55rem] uppercase tracking-[0.4em] text-white/20">Studio</p>
              <p className="text-sm font-semibold text-white">{modeLabels[activeTab]}</p>
            </div>
          </div>
          <Badge className="border-white/8 bg-white/[0.04] text-white/40 text-xs">{status}</Badge>
        </div>
      </header>

      {/* ── Content ── */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="grid gap-8 lg:grid-cols-[1fr_1.15fr]">

          {/* Left — Controls */}
          <div className="space-y-5">
            {/* Tab Switcher */}
            <div className="flex gap-1 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-1">
              {TAB_ITEMS.map((tab) => {
                const isActive = activeTab === tab.value;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setActiveTab(tab.value)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-medium tracking-wide transition-all duration-300 ${
                      isActive
                        ? "bg-white/[0.1] text-white shadow-[0_2px_12px_rgba(255,255,255,0.06)]"
                        : "text-white/35 hover:text-white/60 hover:bg-white/[0.04]"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <Card className="overflow-hidden border-white/[0.06] bg-white/[0.02]">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">
                  {activeTab === "image" && "Generate Image"}
                  {activeTab === "edit" && "Edit Image"}
                  {activeTab === "video" && "Generate Video"}
                </CardTitle>
                <CardDescription className="text-sm text-white/30">
                  {activeTab === "image" && "Describe what you want to create."}
                  {activeTab === "edit" && "Upload a photo and describe the edit."}
                  {activeTab === "video" && "Upload a first frame and describe the motion."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* ── IMAGE TAB ── */}
                {activeTab === "image" && (
                  <form className="space-y-4" onSubmit={submitImageGeneration}>
                    <div className="space-y-2">
                      <Label htmlFor="prompt-img" className="text-[0.65rem] uppercase tracking-[0.3em] text-white/30">Prompt</Label>
                      <Textarea id="prompt-img" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe subject, lighting, wardrobe..." className="min-h-28 rounded-xl border-white/[0.06] bg-black/40 text-sm text-white placeholder:text-white/15 focus:border-white/20" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[0.65rem] uppercase tracking-[0.3em] text-white/30">Style Presets</Label>
                      <div className="grid gap-2">
                        {STYLE_PRESETS.map((p) => (
                          <PresetThumbnail key={p.key} preset={p} isActive={selectedPresetKey === p.key} onSelect={applyPreset} />
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button type="submit" className="rounded-xl border border-white/15 bg-white/[0.08] text-white text-xs hover:bg-white/15" disabled={loadingMode === "image"}>
                        {loadingMode === "image" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
                        {loadingMode === "image" ? "Generating..." : "Generate"}
                      </Button>
                      <Button type="button" variant="ghost" className="rounded-xl text-white/40 text-xs hover:bg-white/[0.04] hover:text-white/60" onClick={() => { setImageUrl(""); setStatus("Ready"); }}>Reset</Button>
                      {imageUrl && <Button type="button" variant="ghost" className="rounded-xl text-white/40 text-xs hover:bg-white/[0.04] hover:text-white/60" onClick={() => downloadAsset(imageUrl, "generated-image")}><Download className="h-3.5 w-3.5" /> Save</Button>}
                    </div>
                  </form>
                )}

                {/* ── EDIT TAB ── */}
                {activeTab === "edit" && (
                  <form className="space-y-4" onSubmit={submitImageEdit}>
                    <div className="space-y-2">
                      <Label htmlFor="edit-upload" className="text-[0.65rem] uppercase tracking-[0.3em] text-white/30">Source Image</Label>
                      <div className="rounded-xl border border-dashed border-white/10 bg-black/30 p-4 text-center">
                        {editSourceImage ? (
                          <div className="space-y-2">
                            <p className="text-sm text-white/50">{editSourceImage.name}</p>
                            <button type="button" onClick={() => setEditSourceImage(null)} className="text-xs text-white/30 underline hover:text-white/50">Remove</button>
                          </div>
                        ) : (
                          <label htmlFor="edit-upload" className="flex cursor-pointer flex-col items-center gap-2 py-4">
                            <Upload className="h-6 w-6 text-white/20" />
                            <span className="text-xs text-white/30">Click to upload an image</span>
                          </label>
                        )}
                        <Input id="edit-upload" type="file" accept="image/*" className="hidden" onChange={(e) => setEditSourceImage(e.target.files?.[0] ?? null)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prompt-edit" className="text-[0.65rem] uppercase tracking-[0.3em] text-white/30">Edit Prompt</Label>
                      <Textarea id="prompt-edit" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe what to change: background, style, colors..." className="min-h-24 rounded-xl border-white/[0.06] bg-black/40 text-sm text-white placeholder:text-white/15 focus:border-white/20" />
                    </div>
                    <p className="text-[0.65rem] text-white/20">
                      Note: Uses {`Imagen 4`}. The model will attempt to apply your prompt as an edit to the uploaded image.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button type="submit" className="rounded-xl border border-white/15 bg-white/[0.08] text-white text-xs hover:bg-white/15" disabled={loadingMode === "edit"}>
                        {loadingMode === "edit" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Pencil className="h-3.5 w-3.5" />}
                        {loadingMode === "edit" ? "Editing..." : "Edit Image"}
                      </Button>
                      <Button type="button" variant="ghost" className="rounded-xl text-white/40 text-xs hover:bg-white/[0.04] hover:text-white/60" onClick={() => { setEditUrl(""); setStatus("Ready"); }}>Reset</Button>
                      {editUrl && <Button type="button" variant="ghost" className="rounded-xl text-white/40 text-xs hover:bg-white/[0.04] hover:text-white/60" onClick={() => downloadAsset(editUrl, "edited-image")}><Download className="h-3.5 w-3.5" /> Save</Button>}
                    </div>
                  </form>
                )}

                {/* ── VIDEO TAB ── */}
                {activeTab === "video" && (
                  <form className="space-y-4" onSubmit={submitVideoGeneration}>
                    <div className="space-y-2">
                      <Label htmlFor="prompt-vid" className="text-[0.65rem] uppercase tracking-[0.3em] text-white/30">Video Prompt</Label>
                      <Textarea id="prompt-vid" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe motion, camera move, tempo..." className="min-h-24 rounded-xl border-white/[0.06] bg-black/40 text-sm text-white placeholder:text-white/15 focus:border-white/20" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vid-upload" className="text-[0.65rem] uppercase tracking-[0.3em] text-white/30">First Frame</Label>
                      <div className="rounded-xl border border-dashed border-white/10 bg-black/30 p-4">
                        <Input id="vid-upload" type="file" accept="image/*" onChange={(e) => setSourceImage(e.target.files?.[0] ?? null)} className="cursor-pointer border-0 bg-transparent px-0 py-0 text-xs text-white/40 file:mr-3 file:rounded-lg file:border file:border-white/10 file:bg-white/[0.05] file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white/60 hover:file:bg-white/10" />
                        <p className="mt-2 text-[0.65rem] text-white/20">{sourceImage ? `Selected: ${sourceImage.name}` : "Upload a still to guide motion."}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button type="submit" className="rounded-xl border border-white/15 bg-white/[0.08] text-white text-xs hover:bg-white/15" disabled={loadingMode === "video"}>
                        {loadingMode === "video" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                        {loadingMode === "video" ? "Generating..." : "Generate Video"}
                      </Button>
                      <Button type="button" variant="ghost" className="rounded-xl text-white/40 text-xs hover:bg-white/[0.04] hover:text-white/60" onClick={() => { setVideoUrl(""); setStatus("Ready"); }}>Reset</Button>
                      {videoUrl && <Button type="button" variant="ghost" className="rounded-xl text-white/40 text-xs hover:bg-white/[0.04] hover:text-white/60" onClick={() => downloadAsset(videoUrl, "generated-video")}><Download className="h-3.5 w-3.5" /> Save</Button>}
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right — Output */}
          <div className="space-y-5">
            <Card className="overflow-hidden border-white/[0.06] bg-white/[0.02]">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Output</CardTitle>
                    <CardDescription className="mt-1 text-xs text-white/25">
                      {selectedPreset ? `${selectedPreset.title} preset` : "Custom prompt"} · {modeLabels[activeTab]}
                    </CardDescription>
                  </div>
                  <Badge className="border-white/[0.06] bg-white/[0.03] text-white/25 text-[0.6rem]">live</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <OutputFrame
                  src={currentOutput}
                  loading={loadingMode !== null}
                  emptyLabel={`Your ${modeLabels[activeTab].toLowerCase()} output will appear here`}
                  mode={activeTab}
                />
              </CardContent>
            </Card>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="glass-card rounded-xl p-4">
                <p className="text-[0.55rem] uppercase tracking-[0.35em] text-white/20">Prompt</p>
                <p className="mt-1.5 text-xs leading-relaxed text-white/35">{prompt}</p>
              </div>
              <div className="glass-card rounded-xl p-4">
                <p className="text-[0.55rem] uppercase tracking-[0.35em] text-white/20">Session</p>
                <p className="mt-1.5 text-xs leading-relaxed text-white/35">{selectedPreset ? selectedPreset.summary : "Choose a preset or write a custom prompt."}</p>
              </div>
            </div>

            {/* Gallery */}
            <div className="grid grid-cols-3 gap-3">
              {STYLE_PRESETS.map((preset) => (
                <button key={preset.key} type="button" onClick={() => applyPreset(preset)} className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${selectedPresetKey === preset.key ? "border-white/20" : "border-white/[0.06] hover:border-white/12"}`}>
                  <div className="relative aspect-[3/4]">
                    <Image src={preset.image} alt={preset.title} fill sizes="(max-width: 1024px) 33vw, 180px" className="object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-2.5 left-3 right-3">
                      <p className="text-[0.5rem] uppercase tracking-[0.25em] font-medium text-white/45">{preset.label}</p>
                      <p className="text-xs font-semibold text-white">{preset.title}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
