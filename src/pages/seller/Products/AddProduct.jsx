import AdminText from '../../../shared/Text/AdminText'

const AddProduct = () => {

  const boxStyle = 'border border-gray-200 p-4 rounded-lg shadow';
  const lineStyle = 'w-full h-[1px] bg-gray-300 mb-4'
  const labelStyle = 'block text-sm font-medium text-gray-900 pb-2';
  const inputStyle = 'w-full border-gray-200 outline-none border px-3 py-2 rounded-lg mb-3';
  const buttonStyle = "bg-[var(--color-orange)] text-white md:px-4 md:py-2 px-2 py-1 rounded-lg";
  
  return (
    <div className='min-h-screen'>
      <AdminText>Ürün Ekle</AdminText>

      {/* Form Alanı */}
      <form className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sol Form */}
        <div className="space-y-6">
          <div className={boxStyle}>
            <h3 className="font-semibold mb-2">Ad ve Açıklama</h3>
            <div className={lineStyle}/>

            <div>
              <label htmlFor="name" className={labelStyle}> Ürün Adı <span className="text-red-500">*</span></label>
              <input type="text" id="name" required className={inputStyle} />
            </div>
            <div>
              <label htmlFor="description" className={labelStyle}>Ürün Açıklaması</label>
              <textarea id='description' className={inputStyle} />
            </div>
          </div>

          <div className={boxStyle}>
            <h3 className="font-semibold mb-2">Kategori</h3>
            <div className={lineStyle}/>
            <div>
              <label htmlFor="category" className={labelStyle}>Ürün Kategorisi <span className="text-red-500">*</span> </label>
              <select id="category" required className={inputStyle}>
                <option value="">Kategori Seçiniz</option>
                <option value="kategori1">Kategori 1</option>
                <option value="kategori2">Kategori 2</option>
              </select>
            </div>
            <div>
              <label htmlFor="subcategory" className={labelStyle}>Ürün Alt Kategorisi <span className="text-red-500">*</span>
              </label>
              <select id="subcategory" required className={inputStyle}>
                <option value="">Alt Kategori Seçiniz</option>
                <option value="altkategori1">Alt Kategori 1</option>
                <option value="altkategori2">Alt Kategori 2</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sağ Form */}
        <div className="space-y-6">
          <div className={boxStyle}>
            <h3 className="font-semibold mb-2">Ürün Detayları</h3>
           <div className={lineStyle}/>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="brand" className={labelStyle}> Marka <span className="text-red-500">*</span>
                </label>
                <select id="brand" required className={inputStyle}>
                  <option value="">Marka Seçiniz</option>
                  <option value="marka1">Marka 1</option>
                  <option value="marka2">Marka 2</option>
                </select>
              </div>

              <div>
                <label htmlFor="stock" className={labelStyle}>Stok Miktarı</label>
                <input type="number" id="stock"  min="0" className={inputStyle}/>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="model" className={labelStyle}>Model Numarası <span className="text-red-500">*</span>
              </label>
              <input type="text" id="model" required className={inputStyle}/>
            </div>
          </div>

          <div className={boxStyle}>
            <h3 className="font-semibold mb-2">Ürün Fiyatı</h3>
            <div className={lineStyle}/>
            <div>
                <label htmlFor="price" className={labelStyle}>Ürün Fiyat<span className="text-red-500">*</span>
              </label>
              <input type="number" id='price' min="0" className={inputStyle}/>
            </div>
          </div>

          <div className={boxStyle}>
            <h3 className="font-semibold mb-2">Ürün Resmi</h3>
           <div className={lineStyle}/>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              <div className="text-center">
                <svg className="mx-auto size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
                  <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
                </svg>
                <div className="mt-4 flex text-sm/6 text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
        </div>
      </form>
      {/* Butonlar */}
      <div className="mt-8 flex md:gap-4 gap-x-2 justify-center">
        <button className={buttonStyle}>Ürünü Kaydet</button>
        <button className={buttonStyle}>Temizle</button>
        <button className={buttonStyle}>Dökümanı Yazdır</button>
      </div>
    </div>
  );
};


export default AddProduct;
