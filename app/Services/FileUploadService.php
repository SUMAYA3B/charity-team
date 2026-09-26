<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadService
{
    /**
     * Upload an image safely and return the stored path.
     *
     * @param  UploadedFile  $file
     * @param  string  $directory
     * @param  string|null  $oldPath  Old path to delete when replacing
     * @param  string  $disk
     */
    public function uploadImage(UploadedFile $file, string $directory, ?string $oldPath = null, string $disk = 'public'): string
    {
        // Validate image (mime + size are enforced both here and in Request rules)
        $this->validateImage($file);

        // Delete old file if exists
        if ($oldPath && Storage::disk($disk)->exists($oldPath)) {
            Storage::disk($disk)->delete($oldPath);
        }

        // Generate a safe unique filename (original extension preserved)
        $extension = $file->getClientOriginalExtension() ?: 'jpg';
        $filename = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME))
            . '-' . Str::random(20)
            . '.' . $extension;

        $path = $file->storeAs($directory, $filename, $disk);

        return $path;
    }

    /**
     * Upload multiple images.
     *
     * @param  array  $files
     * @param  string  $directory
     * @param  string  $disk
     * @return array<int, string>  Array of stored paths
     */
    public function uploadImages(array $files, string $directory, string $disk = 'public'): array
    {
        $paths = [];

        foreach ($files as $file) {
            $paths[] = $this->uploadImage($file, $directory, null, $disk);
        }

        return $paths;
    }

    /**
     * Delete a file if it exists.
     */
    public function delete(?string $path, string $disk = 'public'): void
    {
        if ($path && Storage::disk($disk)->exists($path)) {
            Storage::disk($disk)->delete($path);
        }
    }

    private function validateImage(UploadedFile $file): void
    {
        $allowedMimes = ['jpeg', 'jpg', 'png', 'gif', 'webp', 'svg'];
        $extension = strtolower($file->getClientOriginalExtension());

        if (! in_array($extension, $allowedMimes, true)) {
            throw new \InvalidArgumentException('نوع الصورة غير مسموح به.');
        }

        if ($file->getSize() > 5 * 1024 * 1024) { // 5MB
            throw new \InvalidArgumentException('حجم الصورة يتجاوز الحد الأقصى (5MB).');
        }
    }
}
