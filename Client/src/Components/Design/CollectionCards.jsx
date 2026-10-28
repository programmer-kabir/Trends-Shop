import React from 'react'

const CollectionCards = ({image}) => {
  return (
    <div style={{boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px"}} className="overflow-hidden  h-auto rounded-md relative group">
    <img
      src={image}
      alt="Card Image"
      className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-black"
    />
    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-500 ease-in-out"></div>
  </div>
  )
}

export default CollectionCards