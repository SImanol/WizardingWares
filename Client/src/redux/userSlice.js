import { createAsyncThunk, createSlice, createAction } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
import removeCookie from '../hooks/removeCookie';
import setCookie from '../hooks/setCookie';

const initialState = {
  cartProducts: null,
  products: [],
  allProducts: [],
  detail: [],
  display: '',
  filterCategory: false,
  filterPrice: [],
  sort: ['SortR', 'SortP', 'SortN'],
  search: '',
  page: 1,
  price: 0,
  purchases: [],
  userAddress: null,
  reviews: [],
  selectedCategory: Cookies.get('selectedCategory') || '',
  searchTerm: '',
  clientId: null,
};

export const getProducts = createAsyncThunk(
  'user/getProducts', 
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('/allProducts');
      return response.data;
    } catch (error) {
      //console.error('Error al obtener los productos:', error);
      throw error;
    }
  }
);

export const filterCategory = createAsyncThunk(
  'user/filterCategory', 
  async (filter, { getState }) => {
    try {
      const state = getState();
      if (state.user.filterPrice.length) {
        const minPrice = state.user.filterPrice[0];
        const maxPrice = state.user.filterPrice[1];
        const response = await axios.get(`/filteredProducts?category=${filter}&minPrice=${minPrice}&maxPrice=${maxPrice}`);
        return [filter, response.data];
      }
      const response = await axios.get(`/filteredProducts?category=${filter}`);
      return [filter, response.data];
    } catch (error) {
      //console.error('Error obtaining filtered products', error);
      throw error;
    }
  }
);

export const filterPrice = createAsyncThunk(
  'user/filterPrice',
   async (prices, { getState }) => {
  try {
    const minPrice = prices[0];
    const maxPrice = prices[1];
    const state = getState();
    if(state.user.filterCategory){
      const category = state.user.filterCategory;
      const response = await axios.get(`/filteredProducts?category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}`);
      return [minPrice, maxPrice, response.data];
    }        
    const response = await axios.get(`/filteredProducts?minPrice=${minPrice}&maxPrice=${maxPrice}`);
    return [minPrice, maxPrice, response.data];
  } catch (error) {
    //console.error('Error obtaining filtered products', error);
    throw error;
  }
});

export const searchByName = createAsyncThunk(
  'user/searchByName',
  async (searchQuery) => {
    try {
      const response = await axios.get(`/searchProduct?name=${searchQuery}`);
      return [searchQuery, response.data];
    } catch (error) {
      //console.error('Error obtaining filtered products', error);
      throw error;
    }
  }
)

export const changePage = createAction('user/changePage');
export const sortByNameAscending = createAction('user/sortByNameAscending');
export const sortByNameDescending = createAction('user/sortByNameDescending');
export const sortByPriceAscending = createAction('user/sortByPriceAscending');
export const sortByPriceDescending = createAction('user/sortByPriceDescending');

export const addToCart = createAsyncThunk(
  'user/addToCart',
  async (product) => {
    return product
  }
)
// export const addToCart = createAction('user/addToCart')
export const removeFromCart = createAsyncThunk(
  'user/removeFromCart',
  (id) => {
    return id
  }
  );

export const increaseQuantity = createAsyncThunk(
  'user/increaseQuantity',
  (product) => {
    return product
  }
)
export const decreaseQuantity = createAsyncThunk(
  'user/decreaseQuantity',
  (product) => {
    return product
  }
)

export const clearCart = createAction('user/clearCart');

export const updateTotalPrice = createAction('user/updateTotalPrice');

export const getPurchases = createAsyncThunk(
  'user/getPurchases', 
  async(userId, thunkAPI) => {
    try {
      const response = await axios.get(`/getAllPurchById/${userId}`)
      return response.data
    } catch (error) {
      //console.error('Error obtaining Purchases', error);
      throw error;
    }
  }
);

export const createAddress = createAsyncThunk('user/createAddress',
  async (input) => {
    const response = await axios.post("/userAddress", input)
    return response; 
  }
)
export const getProductReviews = createAsyncThunk(
  'user/getProductReviews',
  async (productId) => {
    try {
      const response = await axios.get(`/detailProduct/${productId}`);
      return response.data;
    } catch (error) {
      //console.error('Error al obtener las reviews del producto:', error);
      throw error;
    }
  }
)
export const createProductReview = createAsyncThunk(
  'user/createProductReview',
  async ({productId, userId, comment, rating} ) => {
    try {
      const response = await axios.post(`/createReview/${productId}?userId=${userId}`, {comment, rating });
      // console.log(response.data)
      return response.data;
    } catch (error) {
      //console.error('Error al crear la review:', error);
      throw error;
    }
  }
);

export const getUserAddress = createAsyncThunk('user/getUserAddress',
async (userId) => {
  const response = await axios.get(`/userAddress/${userId}`)
  return response.data; 
}
)

export const createPreference = createAsyncThunk('user/createPreference', 
  async (items) => {
    try {
        const response = await axios.post("/create-order", {items});
    const { body } = response.data;
    
    if(body){
      //redirecciona al usuario a la URL de mercadopago
      window.location.href = await body.init_point
    }
    return body;
    } catch (error) {
        //console.log(error);
    }
  }
)

export const createPurchase = createAsyncThunk('user/createPurchase',
async (input) => {
  const response = await axios.post(`/createPurchase`, input)
  return response; 
}
) 

export const getWebhook = createAsyncThunk(
  'user/getWebhook',
  async () => {
    const response = await axios.get('/recievewebhook')
    return response
  }
);

export const setSearchTerm = createAction('user/setSearchTerm')


export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.filterCategory = false;
        state.filterPrice = [];
        state.sort = ['SortR', 'SortP', 'SortN'];
        state.search = ''
        state.searchTerm = ''
        removeCookie('selectedCategory')
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        //console.error('Error al obtener los productos:', action.error);
      })
      .addCase(getProducts.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(filterCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.page = 1;
        state.products = action.payload[1];
        state.filterCategory = action.payload[0];
        state.searchTerm = ''
        removeCookie('selectedCategory');
        setCookie('selectedCategory', action.payload[0])
      })
      .addCase(filterCategory.rejected, (state, action) => {
        state.loading = false;
        //console.error('Error obtaining filtered products ', action.error);
      })
      .addCase(filterCategory.pending, (state, action) => {
        state.loading = true;
        // console.log(action);
      })
      .addCase(filterPrice.fulfilled, (state, action) => {
        state.loading = false;
        state.page = 1;
        state.products = action.payload[2];
        state.filterPrice = [action.payload[0], action.payload[1]];
      })
      .addCase(filterPrice.rejected, (state, action) => {
        state.loading = false;
        //console.error('Error obtaining filtered products ', action.error);
      })
      .addCase(sortByNameAscending, (state) => {
        state.products.sort((a, b) => a.name.localeCompare(b.name));
        state.sort[2] = 'nameDescending'
      })
      .addCase(sortByNameDescending, (state) => {
        state.products.sort((a, b) => b.name.localeCompare(a.name));
        state.sort[2] = 'nameAscending'
      })
      .addCase(sortByPriceAscending, (state) => {
        state.products.sort((a, b) => b.price-a.price);
        state.sort[1] = 'priceLowToHigh'
      })
      .addCase(sortByPriceDescending, (state) => {
        state.products.sort((a, b) => a.price-b.price);
        state.sort[1] = 'priceHighToLow'
      })
      .addCase(searchByName.fulfilled, (state, action) => {
        state.loading = false;
        state.page = 1;
        state.search = action.payload[0];
        state.products = action.payload[1];
        state.filterCategory = '';
        //console.log(action.payload[0])
        state.searchTerm = action.payload[0]; // Establecer el término de búsqueda en el estado
      })
      .addCase(searchByName.rejected, (state, action) => {
        state.loading = false;
        //console.error('Error obtaining searched products ', action.error);
      })
      .addCase(searchByName.pending, (state, action) => {
        state.loading = true;
        // console.log(action);
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const product = action.payload;
        if (state.cartProducts === null) {
          state.cartProducts = []; // Asigna una matriz vacía si es null
        }
        state.cartProducts = [...state.cartProducts, product];
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        // console.log(action.payload);
        state.cartProducts = state.cartProducts.filter(p => p.productId !== action.payload);
        // console.log(state.products);
      })
      .addCase(clearCart, (state) => {
        state.cartProducts = [];
      })
      .addCase(setSearchTerm, (state) => {
        state.searchTerm = '';
        state.filterCategory= '';
      })
      .addCase(increaseQuantity.fulfilled, (state, action) => {
        state.loading = false
        const index = state.cartProducts.findIndex(
          (p) => p.productId === action.payload.productId
        );
          state.cartProducts[index].quantity += 1
      })
      .addCase(decreaseQuantity.fulfilled, (state, action) => {
        state.loading = false
        const index = state.cartProducts.findIndex(
          (p) => p.productId === action.payload.productId
        );
          state.cartProducts[index].quantity -= 1
      })
      .addCase(updateTotalPrice, (state) => {
        state.price++
      })
      .addCase(changePage, (state, action) => {
        state.page = action.payload;
      })
      .addCase(getPurchases.fulfilled, (state, action) => {
        state.purchases = action.payload;
        state.loading = false;
      })
      .addCase(getPurchases.rejected, (state, action) => {
        state.loading = false;
        //console.error("Error obtaining Purchases: ", action.error);
      })
      .addCase(getPurchases.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.loading = false 
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.loading = false
      })
      .addCase(createAddress.pending, (state, action) => {
        state.loading = true
      })
      .addCase(getUserAddress.fulfilled, (state, action) => {
        state.loading = false
        state.userAddress = action.payload
      })
      .addCase(getUserAddress.rejected, (state, action) => {
        state.loading = false
        // console.log('getuseraddres rejected');
      })
      .addCase(getUserAddress.pending, (state, action) => {
        state.loading = true
      })
      .addCase(getProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(getProductReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.reviews = action.error.message;
      })
      .addCase(createProductReview.fulfilled, (state, action) => {
        const newReview = action.payload;
        state.reviews.push(newReview);

      })
      .addCase(createPurchase.fulfilled, (state, action) => {
        state.paymentStatus = action.payload;
        // console.log(action.payload);

      })
      .addCase(getWebhook.fulfilled, (state, action) => {
        // console.log(action.payload);
        // state.paymentStatus = action.payload;

      })
      .addCase(getWebhook.rejected, (state, action) => {
        // console.log('rejected');

      })
      .addCase(getWebhook.pending, (state, action) => {
        // console.log('pending');
      })
      .addCase(createPreference.fulfilled, (state, action) => {
        // console.log(action.payload.client_id);
        // console.log('funciono');
        // state.paymentStatus = action.payload;

      })
      .addCase(createPreference.rejected, (state, action) => {
        // console.log('rejected');

      })
      .addCase(createPreference.pending, (state, action) => {
        // console.log('pending');
      })
  },
});

export default userSlice.reducer;
