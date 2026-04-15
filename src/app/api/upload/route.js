import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import path from 'path';

const isInvalidCloudinaryValue = (value) => {
  if (!value) return true;
  const normalized = value.toString().trim().toLowerCase();
  return [
    'your_cloud_name',
    'your_api_key',
    'your_api_secret',
    'your_cloudinary_url',
    'cloudinary://your_api_key:your_api_secret@your_cloud_name'
  ].includes(normalized);
};

const loadEnvFile = async () => {
  try {
    const envPath = path.join(process.cwd(), '.env');
    const contents = await fs.readFile(envPath, 'utf8');
    return contents.split(/\r?\n/).reduce((acc, line) => {
      const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)$/);
      if (!match) return acc;
      let [, key, value] = match;
      value = value.trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      acc[key] = value;
      return acc;
    }, {});
  } catch (error) {
    return {};
  }
};

export async function POST(request) {
  try {
    let cloudinaryUrl = process.env.CLOUDINARY_URL;
    let cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    let apiKey = process.env.CLOUDINARY_API_KEY;
    let apiSecret = process.env.CLOUDINARY_API_SECRET;

    if ([cloudinaryUrl, cloudName, apiKey, apiSecret].some((value) => !value || isInvalidCloudinaryValue(value))) {
      const envFile = await loadEnvFile();
      cloudinaryUrl = cloudinaryUrl || envFile.CLOUDINARY_URL;
      cloudName = cloudName || envFile.CLOUDINARY_CLOUD_NAME;
      apiKey = apiKey || envFile.CLOUDINARY_API_KEY;
      apiSecret = apiSecret || envFile.CLOUDINARY_API_SECRET;
    }

    const missing = [
      !cloudinaryUrl && 'CLOUDINARY_URL',
      !cloudName && 'CLOUDINARY_CLOUD_NAME',
      !apiKey && 'CLOUDINARY_API_KEY',
      !apiSecret && 'CLOUDINARY_API_SECRET',
    ].filter(Boolean);

    const invalid = [
      cloudinaryUrl && isInvalidCloudinaryValue(cloudinaryUrl) && 'CLOUDINARY_URL',
      cloudName && isInvalidCloudinaryValue(cloudName) && 'CLOUDINARY_CLOUD_NAME',
      apiKey && isInvalidCloudinaryValue(apiKey) && 'CLOUDINARY_API_KEY',
      apiSecret && isInvalidCloudinaryValue(apiSecret) && 'CLOUDINARY_API_SECRET',
    ].filter(Boolean);

    if (missing.length || invalid.length) {
      const errors = [];
      if (missing.length) errors.push(`missing: ${missing.join(', ')}`);
      if (invalid.length) errors.push(`invalid placeholder values: ${invalid.join(', ')}`);
      console.error('Cloudinary config issues:', errors.join('; '));
      return NextResponse.json(
        { error: `Cloudinary config issues: ${errors.join('; ')}` },
        { status: 500 }
      );
    }

    if (cloudinaryUrl) {
      cloudinary.config({ cloudinary_url: cloudinaryUrl.trim() });
    } else {
      cloudinary.config({
        cloud_name: cloudName.trim(),
        api_key: apiKey.trim(),
        api_secret: apiSecret.trim(),
      });
    }

    // Check if request has proper content type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Invalid content type. Expected multipart/form-data' }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'care-bridge/user_image',
          resource_type: 'image',
          transformation: [
            { width: 300, height: 300, crop: 'fill', gravity: 'face' }
          ]
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({
      error: 'Upload failed: ' + (error.message || 'Unknown error'),
      details: error.message
    }, { status: 500 });
  }
}