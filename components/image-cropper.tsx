"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import getCroppedImg from "@/lib/image-utils";

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: Blob) => void;
  onCancel: () => void;
  aspect?: number;
}

export function ImageCropper({
  image,
  onCropComplete,
  onCancel,
  aspect = 1,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteInternal = useCallback(
    (_croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleSave = async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      if (croppedImage) {
        onCropComplete(croppedImage);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-2xl overflow-hidden rounded-[2rem] p-0 border-none bg-white shadow-2xl">
        <DialogHeader className="px-8 pt-8">
          <DialogTitle className="text-2xl font-bold text-slate-800">Bild zuschneiden</DialogTitle>
          <p className="text-sm text-slate-500">Wähle den Ausschnitt für dein Produktbild.</p>
        </DialogHeader>

        <div className="relative mt-4 h-[400px] w-full bg-slate-900 overflow-hidden">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteInternal}
            showGrid={true}
            classes={{
                containerClassName: "bg-slate-900",
                mediaClassName: "max-w-none",
                cropAreaClassName: "border-2 border-white/50 shadow-[0_0_0_9999px_rgba(15,23,42,0.75)]"
            }}
          />
        </div>

        <div className="px-8 py-6 space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-slate-600 shrink-0">Zoom</span>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(val) => setZoom(val[0])}
              className="flex-1"
            />
          </div>

          <DialogFooter className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="rounded-xl px-6 h-11 font-semibold text-slate-600 border-slate-200 hover:bg-slate-50"
            >
              Abbrechen
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="rounded-xl px-8 h-11 font-bold bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              Speichern
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
