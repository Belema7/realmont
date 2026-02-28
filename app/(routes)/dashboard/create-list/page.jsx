"use client"

import React from "react"

export default function CreateListing() {
  return (
    <main className="min-h-screen bg-muted/30 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Create New Listing
          </h1>
          <p className="text-muted-foreground mt-2">
            Fill in the details below to publish your property.
          </p>
        </div>

        <form className="grid lg:grid-cols-2 gap-10">
          
          {/* LEFT SIDE */}
          <div className="space-y-6">
            
            {/* Basic Info */}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Property Name"
                maxLength="62"
                minLength="10"
                required
                className="w-full rounded-xl border bg-background px-4 py-3 
                           focus:outline-none focus:ring-2 focus:ring-primary/40"
              />

              <textarea
                placeholder="Description"
                required
                rows="4"
                className="w-full rounded-xl border bg-background px-4 py-3 
                           focus:outline-none focus:ring-2 focus:ring-primary/40"
              />

              <input
                type="text"
                placeholder="Address"
                required
                className="w-full rounded-xl border bg-background px-4 py-3 
                           focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {/* Property Type */}
            <div>
              <label className="block font-semibold mb-3">
                Property Options
              </label>
              <div className="grid grid-cols-2 gap-4">
                {["Sell", "Rent", "Parking Spot", "Furnished", "Offer"].map(
                  (item) => (
                    <label
                      key={item}
                      className="flex items-center gap-3 border rounded-xl p-3 
                                 cursor-pointer hover:bg-muted transition"
                    >
                      <input type="checkbox" className="w-4 h-4" />
                      <span>{item}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Numbers Section */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Beds", id: "beds" },
                { label: "Baths", id: "baths" },
                { label: "Regular Price ($/month)", id: "regularPrice" },
                { label: "Discount Price ($/month)", id: "discountPrice" },
              ].map((field) => (
                <div key={field.id} className="space-y-2">
                  <label className="text-sm font-medium">
                    {field.label}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="w-full rounded-xl border px-4 py-3 
                               focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            
            {/* Image Upload */}
            <div className="border rounded-2xl p-6 bg-muted/20">
              <h2 className="font-semibold text-lg mb-2">Upload Images</h2>
              <p className="text-sm text-muted-foreground mb-4">
                The first image will be used as the cover (max 6).
              </p>

              <input
                type="file"
                accept="image/*"
                multiple
                className="w-full rounded-xl border px-4 py-3 bg-background"
              />

              <button
                type="button"
                className="mt-4 w-full rounded-xl border border-primary 
                           text-primary py-3 font-medium 
                           hover:bg-primary hover:text-white transition"
              >
                Upload Images
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-xl bg-primary text-white 
                         py-4 text-lg font-semibold 
                         hover:opacity-90 transition shadow-lg"
            >
              Create Listing
            </button>
          </div>

        </form>
      </div>
    </main>
  )
}