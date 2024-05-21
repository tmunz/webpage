interface ImgData {
  data: Float64Array;
  width: number;
  height: number;
}

export class StipplingService {

  private static instance: StipplingService | null = null;

  private constructor() { }

  static get = (): StipplingService => {
    if (!StipplingService.instance) {
      StipplingService.instance = new StipplingService();
    }
    return StipplingService.instance;
  };

  generate = async (params: { imgPath: string, width: number, samples: number, threshold: number }): Promise<{ x: number, y: number }[]> => {
    const imgData: ImgData = { ...(await this.getImgData(params.imgPath, params.width)) };
    const points = this.sample(imgData, params.samples, params.threshold);
    return points

  }

  // lightness part of rgb to hsl algorithm 
  rgbToLightness = (rgb: { r: number, g: number, b: number }): number => {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    return (Math.min(r, g, b) + Math.max(r, g, b)) / 2;
  }

  getImgData = async (imgPath: string, width: number): Promise<ImgData> => {
    const img = await (await fetch(imgPath)).blob();
    const imageBitmap = await createImageBitmap(img);
    const canvas = document.createElement('canvas');
    const height = width / imageBitmap.width * imageBitmap.height;
    canvas.width = width;
    canvas.height = height;
    let context = canvas.getContext('2d');
    context!.drawImage(imageBitmap, 0, 0, imageBitmap.width, imageBitmap.height, 0, 0, width, height);
    const { data: rgba } = context!.getImageData(0, 0, width, height);
    const data = new Float64Array(width * height);
    const l = rgba.length / 4;
    for (let i = 0; i < l; i++) {
      let alpha = rgba[i * 4 + 3] / 255;
      let lightness = this.rgbToLightness({ r: rgba[i * 4], g: rgba[i * 4 + 1], b: rgba[i * 4 + 2] });
      data[i] = alpha * (1 - lightness);
    };
    return { data, width, height };
  }

  sample = (imgData: ImgData, samples: number, threshold: number): { x: number, y: number }[] => {
    const possiblePoints = [];
    const sampledPoints = []
    for (let i = 0; i < imgData.data.length; i++) {
      if (threshold <= imgData.data[i]) {
        possiblePoints.push({ x: i % imgData.width, y: Math.floor(i / imgData.width) });
      }
    }
    if (possiblePoints.length === 0 && 0 < samples) {
      console.warn('no possible points for samples');
    } else {
      for (let i = 0; i < samples; i++) {
        sampledPoints.push(possiblePoints[Math.floor((Math.random() * possiblePoints.length))]);
      }
    }
    return sampledPoints;
  }
}
