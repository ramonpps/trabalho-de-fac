import cv2
import matplotlib.pyplot as plt
from PIL import Image
import numpy as np
from utils import detect_horizon_line

def main():
    """Main logic"""

    vid = True
    if(vid):
        # cap = cv2.VideoCapture('sampleBoat2.mp4')
        cap = cv2.VideoCapture(1)
        while(cap.isOpened()):
            ret, image = cap.read()
            if(image is not None):
                lo=np.array([50,50,50])
                hi=np.array([100,75,85])

                # Mask image to only select browns
                mask=cv2.inRange(image,lo,hi)

                # Change image to red where we found brown
                image[mask>0]=(0,0,255)
        
                image_grayscale = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
                horizon_x1, horizon_x2, horizon_y1, horizon_y2 = detect_horizon_line(
                    image_grayscale
                )
                line_thickness = 2
                cv2.line(image, (horizon_x1, horizon_y1), (horizon_x2, horizon_y2), (0, 255, 0), thickness=line_thickness)
                cv2.imshow('frame',image)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        cap.release()
        cv2.destroyAllWindows()
    else:
        fpath_image = '\images\sample6.jpg'
        path = r'G:\My Drive\Innomaker\Source code\horizon-detection - Copy\images\sample7.jpg'
        image = cv2.imread(path)
        cv2.imshow('frame',image)

    
        color = ('b','g','r')
        for i,col in enumerate(color):
            histr = cv2.calcHist([image],[i],None,[256],[0,256])
            plt.plot(histr,color = col)
            plt.xlim([0,256])
        plt.show()

        b = image.copy()
        # set green and red channels to 0
        b[:, :, 1] = 0
        b[:, :, 2] = 0


        g = image.copy()
        # set blue and red channels to 0
        g[:, :, 0] = 0
        g[:, :, 2] = 0

        r = image.copy()
        # set blue and green channels to 0
        r[:, :, 0] = 0
        r[:, :, 1] = 0
        
        # RGB - Blue
        cv2.imshow('B-RGB', b)

        # RGB - Green
        cv2.imshow('G-RGB', g)

        # RGB - Red
        cv2.imshow('R-RGB', r)
    

        lo=np.array([50,50,50])
        hi=np.array([100,75,85])

        # Mask image to only select browns
        mask=cv2.inRange(image,lo,hi)

        # Change image to red where we found brown
        image[mask>0]=(0,0,255)
     

        # cv2.imshow('rebuild',new_image)   
        plt.imshow(b, interpolation='nearest')
        plt.show()

        image_grayscale = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        horizon_x1, horizon_x2, horizon_y1, horizon_y2 = (
            detect_horizon_line(image_grayscale)
        )
        line_thickness = 2
        cv2.line(image, (horizon_x1, horizon_y1), (horizon_x2, horizon_y2), (0, 255, 0), thickness=line_thickness)
        # print(image.shape)
        cv2.imshow('masked',image)
        cv2.waitKey(10000)
        cv2.destroyAllWindows()
        # if cv2.waitKey(1) & 0xFF == ord('q'):
        #     exit



if __name__ == '__main__':
    main()
