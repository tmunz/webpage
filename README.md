# webpage ![logo](./public/favicon-32x32.png)  
[![license](https://img.shields.io/github/license/tmunz/webpage.svg)](LICENSE)  
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

in this repository the source code to Tobias Munzert's personal [webpage](https://tmunz.art) can be found.

## Table of Contents

- [Security](#security)
- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Contributing](#contributing)
- [License](#license)

## Background

`webpage` was developed to showcase the portfolio of Tobias Munzert, which includs experimental and fun code projects as well as captivating photography to let you explore a blend of creativity and technical expertise.

## Install

This project requires Node.js and npm. Clone the repository and install dependencies with the following commands:
```bash
git clone https://github.com/tmunz/webpage.git
cd webpage
npm install
```

### Dependencies

The project uses a variety of packages for its functionality:
- **React, React DOM and React Router**: user interfaces library and routing
- **RxJS**: basis for reactive state handling
- **@react-three/fiber, @react-three/drei, three, Leva**: 3D rendering, scene management, and its GUI controls while developing.
- **D3**: data-driven visualizations.
- **Figlet**: rendering ASCII art.


## Usage

To start the development server:

```bash
npm run start
```

To build the project for production:

```bash
npm run build
```

To run tests:

```bash
npm run test
```

Note: The development server runs with hot module replacement enabled, allowing changes to be immediately reflected without restarting the server.

## API

The project serves static files and a React-based front-end application. The main entry point for the application is `src/index.tsx`.

## License

The code of this project is licensed under the MIT License, however All assets such as images, graphics, or models (e.g., jpg, jpeg, png, gif, webp, svg, glb) bundled with this software remain the intellectual property of their respective creators or rights holders. See the [LICENSE](LICENSE) file for details.

---

This README follows the [standard-readme](https://github.com/RichardLitt/standard-readme) specifications. For any changes to this README, please conform to the specification requirements.
