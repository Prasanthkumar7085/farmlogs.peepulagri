import { Backdrop, CircularProgress } from "@mui/material";
import Lottie from "react-lottie-player";

const LoadingComponent = ({ loading }: { loading: Boolean }) => {
  let animationData = {
    v: "5.1.10",
    fr: 25,
    ip: 0,
    op: 23,
    w: 600,
    h: 600,
    nm: "76 fill",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Shape Layer 1",
        sr: 1,
        ks: {
          o: { a: 0, k: 100, ix: 11 },
          r: { a: 0, k: 0, ix: 10 },
          p: { a: 0, k: [300, 403, 0], ix: 2 },
          a: { a: 0, k: [0, 103, 0], ix: 1 },
          s: {
            a: 1,
            k: [
              {
                i: { x: [0.667, 0.667, 0.667], y: [1, 1, 1] },
                o: { x: [0.167, 0.167, 0.167], y: [0.167, 0.167, 0] },
                n: [
                  "0p667_1_0p167_0p167",
                  "0p667_1_0p167_0p167",
                  "0p667_1_0p167_0",
                ],
                t: 0,
                s: [50, 50, 100],
                e: [106, 106, 100],
              },
              {
                i: { x: [0.833, 0.833, 0.833], y: [1, 1, 1] },
                o: { x: [0.333, 0.333, 0.333], y: [0, 0, 0] },
                n: ["0p833_1_0p333_0", "0p833_1_0p333_0", "0p833_1_0p333_0"],
                t: 10,
                s: [106, 106, 100],
                e: [97, 97, 100],
              },
              {
                i: { x: [0.833, 0.833, 0.833], y: [1, 1, 1] },
                o: { x: [0.167, 0.167, 0.167], y: [0, 0, 0] },
                n: ["0p833_1_0p167_0", "0p833_1_0p167_0", "0p833_1_0p167_0"],
                t: 13,
                s: [97, 97, 100],
                e: [102, 102, 100],
              },
              {
                i: { x: [0.833, 0.833, 0.833], y: [1, 1, 1] },
                o: { x: [0.167, 0.167, 0.167], y: [0, 0, 0] },
                n: ["0p833_1_0p167_0", "0p833_1_0p167_0", "0p833_1_0p167_0"],
                t: 16,
                s: [102, 102, 100],
                e: [99, 99, 100],
              },
              {
                i: { x: [0.833, 0.833, 0.833], y: [1, 1, 1] },
                o: { x: [0.167, 0.167, 0.167], y: [0, 0, 0] },
                n: ["0p833_1_0p167_0", "0p833_1_0p167_0", "0p833_1_0p167_0"],
                t: 18,
                s: [99, 99, 100],
                e: [101, 101, 100],
              },
              {
                i: { x: [0.833, 0.833, 0.833], y: [1, 1, 1] },
                o: { x: [0.167, 0.167, 0.167], y: [0, 0, 0] },
                n: ["0p833_1_0p167_0", "0p833_1_0p167_0", "0p833_1_0p167_0"],
                t: 20,
                s: [101, 101, 100],
                e: [100, 100, 100],
              },
              { t: 21 },
            ],
            ix: 6,
          },
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              {
                ind: 0,
                ty: "sh",
                ix: 1,
                ks: {
                  a: 0,
                  k: {
                    i: [
                      [2.628, -3.162],
                      [-98.087, 4.687],
                    ],
                    o: [
                      [-2.583, 3.108],
                      [0.586, -81.375],
                    ],
                    v: [
                      [-95.75, 15],
                      [-3, 91],
                    ],
                    c: true,
                  },
                  ix: 2,
                },
                nm: "Path 1",
                mn: "ADBE Vector Shape - Group",
                hd: false,
              },
              {
                ty: "tm",
                s: { a: 0, k: 0, ix: 1 },
                e: {
                  a: 1,
                  k: [
                    {
                      i: { x: [0.533], y: [1.004] },
                      o: { x: [0.167], y: [0.167] },
                      n: ["0p533_1p004_0p167_0p167"],
                      t: 4,
                      s: [0],
                      e: [100],
                    },
                    { t: 16 },
                  ],
                  ix: 2,
                },
                o: { a: 0, k: 185, ix: 3 },
                m: 1,
                ix: 2,
                nm: "Trim Paths 1",
                mn: "ADBE Vector Filter - Trim",
                hd: false,
              },
              {
                ty: "st",
                c: {
                  a: 0,
                  k: [0.207843139768, 0.203921571374, 0.164705887437, 1],
                  ix: 3,
                },
                o: { a: 0, k: 100, ix: 4 },
                w: { a: 0, k: 11, ix: 5 },
                lc: 2,
                lj: 1,
                ml: 4,
                nm: "Stroke 1",
                mn: "ADBE Vector Graphic - Stroke",
                hd: false,
              },
              {
                ty: "tr",
                p: { a: 0, k: [2.228, -58.877], ix: 2 },
                a: { a: 0, k: [0, 0], ix: 1 },
                s: { a: 0, k: [113, 113], ix: 3 },
                r: { a: 0, k: 0, ix: 6 },
                o: { a: 0, k: 100, ix: 7 },
                sk: { a: 0, k: 0, ix: 4 },
                sa: { a: 0, k: 0, ix: 5 },
                nm: "Transform",
              },
            ],
            nm: "Shape 4",
            np: 4,
            cix: 2,
            ix: 1,
            mn: "ADBE Vector Group",
            hd: false,
          },
          {
            ty: "gr",
            it: [
              {
                ind: 0,
                ty: "sh",
                ix: 1,
                ks: {
                  a: 0,
                  k: {
                    i: [
                      [1.75, 2],
                      [0.25, -83.25],
                    ],
                    o: [
                      [-1.75, -2],
                      [99.25, 5.5],
                    ],
                    v: [
                      [95, 60.5],
                      [1.75, 137.25],
                    ],
                    c: true,
                  },
                  ix: 2,
                },
                nm: "Path 1",
                mn: "ADBE Vector Shape - Group",
                hd: false,
              },
              {
                ty: "tm",
                s: { a: 0, k: 0, ix: 1 },
                e: {
                  a: 1,
                  k: [
                    {
                      i: { x: [0.53], y: [0.999] },
                      o: { x: [0.167], y: [0.167] },
                      n: ["0p53_0p999_0p167_0p167"],
                      t: 8,
                      s: [0],
                      e: [100],
                    },
                    { t: 19 },
                  ],
                  ix: 2,
                },
                o: { a: 0, k: 180, ix: 3 },
                m: 1,
                ix: 2,
                nm: "Trim Paths 1",
                mn: "ADBE Vector Filter - Trim",
                hd: false,
              },
              {
                ty: "st",
                c: {
                  a: 0,
                  k: [0.207843139768, 0.203921571374, 0.164705887437, 1],
                  ix: 3,
                },
                o: { a: 0, k: 100, ix: 4 },
                w: { a: 0, k: 11, ix: 5 },
                lc: 2,
                lj: 1,
                ml: 4,
                nm: "Stroke 1",
                mn: "ADBE Vector Graphic - Stroke",
                hd: false,
              },
              {
                ty: "tr",
                p: { a: 0, k: [-1.794, -173.074], ix: 2 },
                a: { a: 0, k: [0, 0], ix: 1 },
                s: { a: 0, k: [113, 113], ix: 3 },
                r: { a: 0, k: 0, ix: 6 },
                o: { a: 0, k: 100, ix: 7 },
                sk: { a: 0, k: 0, ix: 4 },
                sa: { a: 0, k: 0, ix: 5 },
                nm: "Transform",
              },
            ],
            nm: "Shape 3",
            np: 4,
            cix: 2,
            ix: 2,
            mn: "ADBE Vector Group",
            hd: false,
          },
          {
            ty: "gr",
            it: [
              {
                ind: 0,
                ty: "sh",
                ix: 1,
                ks: {
                  a: 0,
                  k: {
                    i: [
                      [0, 0],
                      [0, 0],
                    ],
                    o: [
                      [0, 0],
                      [0, 0],
                    ],
                    v: [
                      [-1.25, 154],
                      [-1.75, 32.5],
                    ],
                    c: false,
                  },
                  ix: 2,
                },
                nm: "Path 1",
                mn: "ADBE Vector Shape - Group",
                hd: false,
              },
              {
                ty: "tm",
                s: { a: 0, k: 0, ix: 1 },
                e: {
                  a: 1,
                  k: [
                    {
                      i: { x: [0.36], y: [1.003] },
                      o: { x: [0.167], y: [0.167] },
                      n: ["0p36_1p003_0p167_0p167"],
                      t: 0,
                      s: [0],
                      e: [100],
                    },
                    { t: 11 },
                  ],
                  ix: 2,
                },
                o: { a: 0, k: 0, ix: 3 },
                m: 1,
                ix: 2,
                nm: "Trim Paths 1",
                mn: "ADBE Vector Filter - Trim",
                hd: false,
              },
              {
                ty: "st",
                c: {
                  a: 0,
                  k: [0.207843139768, 0.203921571374, 0.164705887437, 1],
                  ix: 3,
                },
                o: { a: 0, k: 100, ix: 4 },
                w: { a: 0, k: 12, ix: 5 },
                lc: 2,
                lj: 1,
                ml: 4,
                nm: "Stroke 1",
                mn: "ADBE Vector Graphic - Stroke",
                hd: false,
              },
              {
                ty: "tr",
                p: { a: 0, k: [2, -50], ix: 2 },
                a: { a: 0, k: [0, 0], ix: 1 },
                s: { a: 0, k: [100, 100], ix: 3 },
                r: { a: 0, k: 0, ix: 6 },
                o: { a: 0, k: 100, ix: 7 },
                sk: { a: 0, k: 0, ix: 4 },
                sa: { a: 0, k: 0, ix: 5 },
                nm: "Transform",
              },
            ],
            nm: "Shape 2",
            np: 4,
            cix: 2,
            ix: 3,
            mn: "ADBE Vector Group",
            hd: false,
          },
        ],
        ip: 0,
        op: 250,
        st: 0,
        bm: 0,
      },
      {
        ddd: 0,
        ind: 2,
        ty: 4,
        nm: "Shape Layer 2",
        parent: 1,
        sr: 1,
        ks: {
          o: { a: 0, k: 100, ix: 11 },
          r: { a: 0, k: 0, ix: 10 },
          p: { a: 0, k: [-53, 1, 0], ix: 2 },
          a: { a: 0, k: [-53, 1, 0], ix: 1 },
          s: {
            a: 1,
            k: [
              {
                i: { x: [0.667, 0.667, 0.667], y: [1, 1, 1] },
                o: { x: [0.167, 0.167, 0.167], y: [0.167, 0.167, 16.667] },
                n: [
                  "0p667_1_0p167_0p167",
                  "0p667_1_0p167_0p167",
                  "0p667_1_0p167_16p667",
                ],
                t: 8,
                s: [0, 0, 100],
                e: [100, 100, 100],
              },
              { t: 15 },
            ],
            ix: 6,
          },
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              {
                ind: 0,
                ty: "sh",
                ix: 1,
                ks: {
                  a: 0,
                  k: {
                    i: [
                      [72, -5],
                      [-43, 1],
                    ],
                    o: [
                      [-3.5, 75.75],
                      [3.75, -49.25],
                    ],
                    v: [
                      [-108, -41.5],
                      [-2.5, 46.75],
                    ],
                    c: true,
                  },
                  ix: 2,
                },
                nm: "Path 1",
                mn: "ADBE Vector Shape - Group",
                hd: false,
              },
              {
                ty: "fl",
                c: {
                  a: 0,
                  k: [0.694117647059, 0.827450980392, 0.211764705882, 1],
                  ix: 4,
                },
                o: { a: 0, k: 100, ix: 5 },
                r: 1,
                nm: "Fill 1",
                mn: "ADBE Vector Graphic - Fill",
                hd: false,
              },
              {
                ty: "tr",
                p: { a: 0, k: [0, 0], ix: 2 },
                a: { a: 0, k: [0, 0], ix: 1 },
                s: { a: 0, k: [100, 100], ix: 3 },
                r: { a: 0, k: 0, ix: 6 },
                o: { a: 0, k: 100, ix: 7 },
                sk: { a: 0, k: 0, ix: 4 },
                sa: { a: 0, k: 0, ix: 5 },
                nm: "Transform",
              },
            ],
            nm: "Shape 1",
            np: 3,
            cix: 2,
            ix: 1,
            mn: "ADBE Vector Group",
            hd: false,
          },
        ],
        ip: 0,
        op: 250,
        st: 0,
        bm: 0,
      },
      {
        ddd: 0,
        ind: 3,
        ty: 4,
        nm: "Shape Layer 3",
        parent: 1,
        sr: 1,
        ks: {
          o: { a: 0, k: 100, ix: 11 },
          r: { a: 0, k: 0, ix: 10 },
          p: { a: 0, k: [53, -59, 0], ix: 2 },
          a: { a: 0, k: [53, -59, 0], ix: 1 },
          s: {
            a: 1,
            k: [
              {
                i: { x: [0.667, 0.667, 0.667], y: [1, 1, 1] },
                o: { x: [0.167, 0.167, 0.167], y: [0.167, 0.167, 16.667] },
                n: [
                  "0p667_1_0p167_0p167",
                  "0p667_1_0p167_0p167",
                  "0p667_1_0p167_16p667",
                ],
                t: 11,
                s: [0, 0, 100],
                e: [100, 100, 100],
              },
              { t: 18 },
            ],
            ix: 6,
          },
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              {
                ind: 0,
                ty: "sh",
                ix: 1,
                ks: {
                  a: 0,
                  k: {
                    i: [
                      [-0.297, 61.116],
                      [3.523, -65.14],
                    ],
                    o: [
                      [-65.297, -0.634],
                      [67.773, 0.86],
                    ],
                    v: [
                      [104.047, -103.366],
                      [-1.523, -15.61],
                    ],
                    c: true,
                  },
                  ix: 2,
                },
                nm: "Path 1",
                mn: "ADBE Vector Shape - Group",
                hd: false,
              },
              {
                ty: "fl",
                c: {
                  a: 0,
                  k: [0.694117647059, 0.827450980392, 0.211764705882, 1],
                  ix: 4,
                },
                o: { a: 0, k: 100, ix: 5 },
                r: 1,
                nm: "Fill 1",
                mn: "ADBE Vector Graphic - Fill",
                hd: false,
              },
              {
                ty: "tr",
                p: { a: 0, k: [0, 0], ix: 2 },
                a: { a: 0, k: [0, 0], ix: 1 },
                s: { a: 0, k: [100, 100], ix: 3 },
                r: { a: 0, k: 0, ix: 6 },
                o: { a: 0, k: 100, ix: 7 },
                sk: { a: 0, k: 0, ix: 4 },
                sa: { a: 0, k: 0, ix: 5 },
                nm: "Transform",
              },
            ],
            nm: "Shape 1",
            np: 3,
            cix: 2,
            ix: 1,
            mn: "ADBE Vector Group",
            hd: false,
          },
        ],
        ip: 0,
        op: 250,
        st: 0,
        bm: 0,
      },
    ],
    markers: [],
  };
  return (
    <Backdrop
      sx={{
        display: "flex",
        gap: "10px",
        flexDirection: "column",
        color: "green",
        backgroundColor: "rgba(256, 256, 256, 0.7)",
        zIndex: (theme: any) => theme.zIndex.drawer + 1,
      }}
      open={Boolean(loading)}
    >
      {/* <Lottie
        loop
        animationData={animationData}
        play
        style={{ width: 100, height: 100 }}
      /> */}
      <object type="image/svg+xml" data={"/loading-new.svg"} width={100} height={100}>svg-animation</object>

      Loading...
    </Backdrop>
  );
};
export default LoadingComponent;