<span className="flex items-center">
<span className="h-px flex-1 bg-black"></span>
<span className="shrink-0 px-3 uppercase font-semibold text-[#0284C7]">
  Show Product
</span>
<span className="h-px flex-1 bg-black"></span>
</span>

<div className="flex gap-8 items-center justify-center">
{/* Gender Dropdown */}
<Dropdown
  mainTitle="Filter by Category"
  title="Select Gender"
  options={["MEN'S", "WOMEN'S", "KID'S"]}
  onSelect={(value) => setSelectedGender(value)}
/>

{/* Filter by subCategory Dropdown */}
<Dropdown
  mainTitle="Filter by SubCategory"
  title="Select SubCategory"
  options={[
    "MAN'S CASUAL",
    "MAN'S FORMAL",
    "MAN'S SPORT",
    "WOMEN'S CASUAL",
    "WOMEN'S FORMAL",
    "WOMEN'S SPORT",
    "KID'S CASUAL",
    "KID'S FORMAL",
    "KID'S FORMAL",
  ]}
  onSelect={(value) => setSelectedSubCategory(value)}
/>

{/* Sort By Price Dropdown */}
<Dropdown
  mainTitle="Sort By Price"
  title="Sort By Price"
  options={["Low to High", "High to Low"]}
  onSelect={(value) => setSelectedPriceSort(value)}
/>
</div>




