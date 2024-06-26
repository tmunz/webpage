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

  generate = async (params: { imgPath: string, width: number, height: number, samples: number, threshold: number }): Promise<{ x: number, y: number }[]> => {
    if (params.width <= 0) {
      return [];
    }
    const imgData: ImgData = { ...(await this.getImgData(params.imgPath, params.width, params.height)) };
    
    const points = this.sample(imgData, params.samples, params.threshold);
    return points;
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

  // lightness part of rgb to hsl algorithm 
  private rgbToLightness = (rgb: { r: number, g: number, b: number }): number => {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    return (Math.min(r, g, b) + Math.max(r, g, b)) / 2;
  }

  private getImgData = async (imgPath: string, width: number, height: number): Promise<ImgData> => {
    const img = await (await fetch(imgPath)).blob();
    const imageBitmap = await createImageBitmap(img);
    const canvas = document.createElement('canvas');
    const w = Math.floor(width);
    const h = Math.floor(height);
    canvas.width = w
    canvas.height = h;
    let context = canvas.getContext('2d');
    const d = this.imageFitCover(imageBitmap, w, h)
    context!.drawImage(imageBitmap, d.x, d.y, d.w, d.h);
    const { data: rgba } = context!.getImageData(0, 0, w, h);
    const data = new Float64Array(w * h);
    const l = rgba.length / 4;
    for (let i = 0; i < l; i++) {
      let alpha = rgba[i * 4 + 3] / 255;
      let lightness = this.rgbToLightness({ r: rgba[i * 4], g: rgba[i * 4 + 1], b: rgba[i * 4 + 2] });
      data[i] = alpha * (1 - lightness);
    };
    return { data, width: w, height: h };
  }

  private imageFitCover = (img: ImageBitmap, width: number, height: number) => {
    const hRatio = width / img.width;
    const vRatio = height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    return {
      x: (width - img.width * ratio) / 2,
      y: (height - img.height * ratio) / 2,
      w: img.width * ratio,
      h: img.height * ratio
    }
  }
}
