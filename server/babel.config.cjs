module.exports = {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: 'current',
          },
          modules: 'commonjs', // Set the modules option to commonjs
        },
      ],
    ],
  };
  