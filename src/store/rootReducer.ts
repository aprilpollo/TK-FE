import { combineSlices } from '@reduxjs/toolkit';

export interface LazyLoadedSlices {}

export const rootReducer = combineSlices(
	/**
	 * Static slices
	 */
	// navigationSlice,
	/**
	 * Lazy loaded slices
	 */
	// {
	// 	[apiService.reducerPath]: apiService.reducer
	// }
).withLazyLoadedSlices<LazyLoadedSlices>();

export default rootReducer;