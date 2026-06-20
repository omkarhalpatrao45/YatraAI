/**
 * Debug API Response Data
 * Add this to any component to diagnose data rendering issues
 */

export async function debugApiResponse(serviceName, serviceFunction, params = null) {
    console.group(`🔍 Debugging: ${serviceName}`)

    try {
        console.log('📤 Request params:', params)

        const response = await (params ? serviceFunction(params) : serviceFunction())

        console.log('✅ Response received:', response)
        console.log('📊 Response type:', typeof response)
        console.log('📋 Response is array:', Array.isArray(response))
        console.log('🔢 Response length:', Array.isArray(response) ? response.length : 'N/A')

        if (Array.isArray(response) && response.length > 0) {
            console.log('🎯 First item structure:', response[0])
            console.log('🗝️ Keys:', Object.keys(response[0]))
        }

        if (typeof response === 'object' && response !== null && !Array.isArray(response)) {
            console.log('🎯 Object structure:', response)
            console.log('🗝️ Keys:', Object.keys(response))
        }

        return response
    } catch (error) {
        console.error('❌ Error:', error)
        console.error('📍 Error message:', error.message)
        console.error('🔗 Error URL:', error.config?.url)
        console.error('📝 Error status:', error.response?.status)
        console.error('💬 Error response:', error.response?.data)
        throw error
    } finally {
        console.groupEnd()
    }
}

export function validateTripData(trips) {
    console.group('🔍 Validating Trip Data')

    if (!Array.isArray(trips)) {
        console.error('❌ Trips is not an array:', typeof trips)
        return false
    }

    console.log(`✅ Valid array with ${trips.length} items`)

    const requiredFields = ['id', 'destination', 'budget', 'start_date', 'end_date']
    let valid = true

    trips.forEach((trip, index) => {
        const missing = requiredFields.filter(field => !(field in trip))
        if (missing.length > 0) {
            console.error(`❌ Trip ${index} missing fields:`, missing)
            valid = false
        }
    })

    if (valid) {
        console.log('✅ All trips have required fields')
    }

    console.groupEnd()
    return valid
}
