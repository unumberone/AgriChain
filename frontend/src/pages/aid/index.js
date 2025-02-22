import React, { useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Upload } from 'lucide-react'

export default function AidPage() {
  const [fundingReason, setFundingReason] = useState('')
  const [fundingAmount, setFundingAmount] = useState('')

  const ngoList = [
    {
      name: 'Helping Hands',
      needs: [
        { vegetable: 'Tomatoes', quantity: '50 kg' },
        { vegetable: 'Carrots', quantity: '50 kg' },
      ],
    },
    {
      name: 'Green Aid',
      needs: [
        { vegetable: 'Potatoes', quantity: '80 kg' },
        { vegetable: 'Onions', quantity: '80 kg' },
      ],
    },
    {
      name: 'Food For All',
      needs: [
        { vegetable: 'Beans', quantity: '100 kg' },
        { vegetable: 'Capsicum', quantity: '100 kg' },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-emerald-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-white mb-12">
            Agricultural Aid Platform
          </h1>
        </header>

        {/* NGOs List Section */}
        <Card className="bg-white/95 shadow-xl">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-emerald-900">
              NGO Vegetable Requirements
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {ngoList.map((ngo, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg bg-emerald-50 space-y-3"
                >
                  <h3 className="text-xl font-medium text-emerald-800">
                    {ngo.name}
                  </h3>
                  <div className="space-y-2">
                    {ngo.needs.map((need, nIndex) => (
                      <div
                        key={nIndex}
                        className="flex items-center justify-between"
                      >
                        <span className="text-emerald-700">
                          {need.vegetable}: {need.quantity}
                        </span>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                          Donate
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Crowdfunding Section */}
        <Card className="bg-white/95 shadow-xl">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-emerald-900">
              Farmer Crowdfunding
            </h2>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              {/* Reason for Funding */}
              <div>
                <label className="block text-sm font-medium text-emerald-800 mb-2">
                  Reason for Funding
                </label>
                <Textarea
                  value={fundingReason}
                  onChange={(e) => setFundingReason(e.target.value)}
                  className="w-full h-32"
                  placeholder="Explain why you need funding..."
                />
              </div>

              {/* Required Amount */}
              <div>
                <label className="block text-sm font-medium text-emerald-800 mb-2">
                  Required Amount
                </label>
                <Input
                  type="number"
                  value={fundingAmount}
                  onChange={(e) => setFundingAmount(e.target.value)}
                  className="w-full"
                  placeholder="Enter the amount needed"
                />
              </div>

              {/* Supporting Documents */}
              <div>
                <label className="block text-sm font-medium text-emerald-800 mb-2">
                  Supporting Documents
                </label>
                <div className="border-2 border-dashed border-emerald-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-emerald-400" />
                  <p className="mt-2 text-sm text-emerald-600">
                    Upload any proof or relevant documents (land ownership, activity records, etc.)
                  </p>
                  <Button className="mt-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                    Upload Files
                  </Button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="button"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3"
              >
                Post Campaign
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
