import { createCSSParser } from '../src/index';

const parser = createCSSParser({
  context: {
    color: 'black',
  }
});

const styles = parser`
  $color: red;
  
  .images-search-item {

  & .image-thumb {
    height: 250px;
    display: block;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% auto;
    background-color: $color;
  }
}
`;

console.log('styles', styles);
