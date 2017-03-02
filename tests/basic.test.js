import fromPostCSS from '../src/index';

it('plain css parsed to object', () => {
  const colors = {
    main: 'red',
  }

  const style = ({ main }) => fromPostCSS`
    button {
      width: ${nike => '100px'};
      height: 100px;
      background: ${main}
    }
  `
  expect(style(colors)).toEqual({
    button: {
      width: '100px',
      height: '100px',
      background: 'red',
    }
  })
})