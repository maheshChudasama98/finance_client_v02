import React from 'react';

import Box from '@mui/material/Box';

export function Dynamic404Illustration({ sx, ...other }) {
  return (
    <Box
      component="svg"
      xmlns="http://www.w3.org/2000/svg"
      width="810.896"
      height="522.41899"
      viewBox="0 0 810.896 522.41899"
      sx={{
        ...sx,
        '& .primary-color': {
          fill: 'var(--palette-primary-main)',
        },
        '& .primary-dark': {
          fill: 'var(--palette-primary-dark)',
        },
        '& .primary-light': {
          fill: 'var(--palette-primary-light)',
        },
        '& .primary-lighter': {
          fill: 'var(--palette-primary-lighter)',
        },
        '& .primary-darker': {
          fill: 'var(--palette-primary-darker)',
        },
        '& .background-light': {
          fill: 'var(--palette-background-paper)',
        },
        '& .background-neutral': {
          fill: 'var(--palette-background-neutral)',
        },
        '& .text-secondary': {
          fill: 'var(--palette-text-secondary)',
        },
      }}
      {...other}
    >
      {/* Hair and dark elements */}
      <path
        className="primary-darker"
        d="M862.489,219.40751s-12.428-4.438-20.417,13.315-20.417,37.283-20.417,37.283l7.1,1.775s1.775-12.428,6.214-14.2l-1.774,15.977s53.261,18.641,77.228-1.775l-.888-6.214s3.554.889,3.554,6.213l2.663-2.663s-2.663-5.326-10.652-12.428c-5.244-4.661-7.046-13.529-7.665-19.073a23.08084,23.08084,0,0,0-5.314-12.569C886.81,218.89551,877.136,212.35749,862.489,219.40751Z"
        transform="translate(-194.552 -188.7905)"
      />

      {/* Monitor background */}
      <rect className="background-light" x="267" y="225.059" width="434.83701" height="293.36099" />

      {/* Monitor frame */}
      <path
        className="primary-dark"
        d="M897.47,709.20954H459.634v-296.36H897.47Zm-434.837-3H894.471v-290.361H462.633Z"
        transform="translate(-194.552 -188.7905)"
      />

      {/* Monitor screen background */}
      <path
        className="primary-lighter"
        d="M498.552,682.7265H859.895v-244.877H498.552Z"
        transform="translate(-194.552 -188.7905)"
      />

      {/* Chart group */}
      <g>
        {/* Chart circle */}
        <circle className="primary-dark" cx="406.64301" cy="377.057" r="37.928" />

        {/* Chart bars */}
        <path
          className="primary-color"
          d="M720.131,682.73053H534.07a3.79889,3.79889,0,0,1-.7-.055l88-152.425a6.161,6.161,0,0,1,10.725,0l59.06207,102.28,2.829,4.895Z"
          transform="translate(-194.552 -188.7905)"
        />

        {/* Chart bar shadow */}
        <path
          className="primary-color"
          d="M720.132,682.72651H656.605l31.185-45.3,2.246-3.263,1.123-1.632,2.828,4.895Z"
          transform="translate(-194.552 -188.7905)"
          opacity="0.2"
          style={{ isolation: 'isolate' }}
        />

        {/* Chart bar 2 */}
        <path
          className="primary-color"
          d="M823.729,682.72648H662.801l31.185-45.3,2.244-3.263,40.636-59.03a8.22292,8.22292,0,0,1,12.206-.73,7.34064,7.34064,0,0,1,.585.73Z"
          transform="translate(-194.552 -188.7905)"
        />
      </g>

      {/* Person's arm */}
      <path
        className="primary-light"
        d="M902.931,419.22851a10.743,10.743,0,0,0-3.807-16.027l-27.553-93.885-20.981,10.275,33.681,89.055a10.8,10.8,0,0,0,18.66,10.581Z"
        transform="translate(-194.552 -188.7905)"
      />

      {/* Person's shirt */}
      <path
        className="primary-color"
        d="M877.813,324.9955l-23.483,6.357a4.81706,4.81706,0,0,1-6.042-4.086l-2.838-24.087a13.37753,13.37753,0,0,1,25.846-6.915l9.674,22.156a4.81711,4.81711,0,0,1-3.156,6.576Z"
        transform="translate(-194.552 -188.7905)"
      />

      {/* Person's leg */}
      <path
        className="primary-light"
        d="M909.068,508.62451h12.26l5.833-31.8h-18.1Z"
        transform="translate(-194.552 -188.7905)"
      />

      {/* Person's shoe */}
      <path
        className="primary-darker"
        d="M905.941,504.62249H930.09a15.386,15.386,0,0,1,15.387,15.385v.502H905.942Z"
        transform="translate(-194.552 -188.7905)"
      />

      {/* Person's body */}
      <path
        className="primary-darker"
        d="M923.299,491.57451q-.214,0-.43-.021l-16.967-1.235a4.5,4.5,0,0,1-3.809-6.029l22.707-51.015a3.5,3.5,0,0,0-.2-2.8,3.45016,3.45016,0,0,0-2.211-1.76c-10.677-2.791-38.072-10.223-61.786-18.918-10.16-3.726-16.559-9.109-19.019-16-3.243-9.087,1.555-17.374,1.76-17.722l.161-.272,22.315,2.028,24.191,2.058,53.013,28.428a20.086,20.086,0,0,1,8.819,25.784l-24.441,54.808A4.5,4.5,0,0,1,923.299,491.57451Z"
        transform="translate(-194.552 -188.7905)"
      />

      {/* Person's head */}
      <circle className="primary-light" cx="675.14999" cy="63.55" r="24.561" />

      {/* Person's leg 2 */}
      <path
        className="primary-light"
        d="M902.068,507.62451h12.26l5.833-31.8h-18.1Z"
        transform="translate(-194.552 -188.7905)"
      />

      {/* Person's shoe 2 */}
      <path
        className="primary-darker"
        d="M898.941,503.62249H923.09a15.386,15.386,0,0,1,15.387,15.385v.502H898.942Z"
        transform="translate(-194.552 -188.7905)"
      />

      {/* Person's body 2 */}
      <path
        className="primary-darker"
        d="M916.299,494.57451q-.214,0-.43-.021l-16.967-1.235a4.5,4.5,0,0,1-3.809-6.029l22.707-51.015a3.5,3.5,0,0,0-.2-2.8,3.45107,3.45107,0,0,0-2.211-1.76c-10.677-2.791-38.072-10.223-61.786-18.918-10.16-3.726-16.559-9.109-19.019-16-3.243-9.087,1.555-17.374,1.76-17.722l.161-.272,22.315,2.028,24.191,2.058,53.013,28.428a20.086,20.086,0,0,1,8.819,25.784l-24.441,54.808A4.5,4.5,0,0,1,916.299,494.57451Z"
        transform="translate(-194.552 -188.7905)"
      />

      {/* Person's clothing */}
      <path
        className="primary-lighter"
        d="M877.277,290.82851l-26-9s-16.322,12.54-8.481,43.649a77.01216,77.01216,0,0,1-3.4,48.32,49.78149,49.78149,0,0,1-2.619,5.531s29,35,56,9l-10.5-50.5S898.777,304.32851,877.277,290.82851Z"
        transform="translate(-194.552 -188.7905)"
      />

      {/* Person's arm 2 */}
      <path
        className="primary-light"
        d="M940.344,414.72851a10.74306,10.74306,0,0,0-7.691-14.567l-50.135-84.024-17.748,15.192,54.862,77.816a10.8,10.8,0,0,0,20.712,5.584Z"
        transform="translate(-194.552 -188.7905)"
      />

      {/* Person's clothing 2 */}
      <path
        className="primary-lighter"
        d="M892.48,329.76052l-21.15,12.022a4.817,4.817,0,0,1-6.871-2.446l-8.769-22.616a13.37807,13.37807,0,0,1,23.3-13.153h0l14.9,19.037a4.81706,4.81706,0,0,1-1.413,7.156Z"
        transform="translate(-194.552 -188.7905)"
      />

      {/* Person's face */}
      <path
        className="primary-darker"
        d="M841.70079,256.94488S852.75,244.08149,858.965,242.30649a53.461,53.461,0,0,0,10.73579-4.36161s12.34221,11.4636,22.10716,12.3506.888-21.3.888-21.3l-17.754-4.438-16.866,1.775-13.315,8.877Z"
        transform="translate(-194.552 -188.7905)"
      />

      {/* Background circle */}
      <path
        className="primary-lighter"
        d="M194.552,415.33651c0-67.165,54.448-226.546,121.614-226.546s121.614,159.381,121.614,226.546a121.614,121.614,0,0,1-243.227,0Z"
        transform="translate(-194.552 -188.7905)"
      />

      {/* Chart elements */}
      <path
        className="text-secondary"
        d="M316.166,711.2095a1,1,0,0,1-1-1v-419.284a1,1,0,0,1,2,0v419.284A1,1,0,0,1,316.166,711.2095Z"
        transform="translate(-194.552 -188.7905)"
      />

      <path
        className="text-secondary"
        d="M316.166,371.87051a1,1,0,0,1-.707-.293l-48.135-48.134a1,1,0,0,1,1.414-1.414l48.135,48.134a1,1,0,0,1-.707,1.707Z"
        transform="translate(-194.552 -188.7905)"
      />

      <path
        className="text-secondary"
        d="M316.166,455.20049a1,1,0,0,1-.707-1.707l80.61-80.61a1,1,0,1,1,1.43851,1.38949l-.02451.02451-80.61,80.612a1,1,0,0,1-.707.293Z"
        transform="translate(-194.552 -188.7905)"
      />

      {/* Chart background */}
      <path
        className="background-neutral"
        d="M1004.448,711.20851h-743a1,1,0,0,1,0-2h743a1,1,0,0,1,0,2Z"
        transform="translate(-194.552 -188.7905)"
      />

      {/* Chart circle */}
      <path
        className="primary-color"
        d="M350.427,634.42051c0-17.206,13.957-58.034,31.174-58.034s31.175,40.825,31.175,58.034a31.1745,31.1745,0,0,1-62.349,0Z"
        transform="translate(-194.552 -188.7905)"
      />

      {/* Chart lines */}
      <path
        className="background-neutral"
        d="M381.601,710.20852a.256.256,0,0,1-.256-.256V602.54549a.2565.2565,0,1,1,.513,0v107.407a.256.256,0,0,1-.256.256Z"
        transform="translate(-194.552 -188.7905)"
      />

      <path
        className="background-neutral"
        d="M381.601,623.28052a.2551.2551,0,0,1-.181-.075l-12.339-12.33a.25633.25633,0,0,1,.363-.362h0l12.339,12.33a.256.256,0,0,1-.181.437Z"
        transform="translate(-194.552 -188.7905)"
      />

      <path
        className="background-neutral"
        d="M381.601,644.62849a.256.256,0,0,1-.181-.437l20.664-20.65a.25632.25632,0,0,1,.363.362l-20.665,20.65A.255.255,0,0,1,381.601,644.62849Z"
        transform="translate(-194.552 -188.7905)"
      />
    </Box>
  );
}
