import fromPostCSS from '../src/index'

const styles = fromPostCSS`
  color: ${() => 'red'}
  
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
}
`

console.log('Styles:', styles)
