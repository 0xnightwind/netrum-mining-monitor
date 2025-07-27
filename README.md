# 📡 Netrum Mining Monitor

A comprehensive Cloudflare Worker application that provides real-time monitoring of Netrum Protocol (NPT) mining operations for EVM addresses. This tool helps miners track their node performance and verify active mining status through API integration with Netrum Labs.

## 🌟 Features

### Core Functionality
- **Live Mining Statistics**: Real-time display of available NPT tokens ready for claiming
- **Mining Speed Tracking**: Shows current mining rate in tokens per second
- **Activity Verification**: Detects actual mining activity by monitoring token balance changes
- **Address Validation**: Comprehensive EVM address format validation (42-character hex)
- **Error Handling**: Robust error management with user-friendly messages

### User Interface
- **Clean Web Interface**: Responsive HTML form with modern styling
- **Real-time Updates**: Live status display with formatted mining information
- **Progress Indicators**: Clear messaging about processing times and status
- **Mobile Friendly**: Responsive design that works on all devices

## 🔧 How It Works

### Mining Detection Algorithm
1. **Initial Validation**: Validates the provided EVM address format
2. **Live Data Fetch**: Retrieves current mining statistics from Netrum API
3. **Baseline Measurement**: Records current `minedTokens` value
4. **Wait Period**: 30-second monitoring interval for activity detection
5. **Comparison Check**: Compares token values to determine mining activity
6. **Status Display**: Shows comprehensive results including live stats and activity status

### API Integration Flow
```
User Input → Address Validation → Live Mining API Call → 
Baseline Token Check → 30s Wait → Follow-up Token Check → 
Activity Comparison → Results Display
```

## 📊 Output Information

### Live Mining Stats
- **Available Tokens**: Shows NPT tokens ready for claiming (formatted to 6 decimal places)
- **Mining Speed**: Displays current mining rate in tokens per second
- **API Status**: Error handling for API connectivity issues

### Activity Detection
- **Mining Status**: Boolean indicator showing if mining is currently active
- **Change Detection**: Based on actual token balance increases over time
- **Real-time Verification**: More accurate than status flags alone

## 🔌 API Endpoints

### Primary Endpoints Used
| Endpoint | Purpose | Method | Response |
|----------|---------|--------|----------|
| `/api/node/mining/live-log/` | Live mining information | POST | Current stats, speed, available tokens |
| `/api/node/mining/claim/` | Token balance data | POST | Claimable token amounts |

### Request Format
```json
{
  "nodeAddress": "0x1234567890123456789012345678901234567890"
}
```

### Response Structure
```json
{
  "success": true,
  "liveInfo": {
    "minedTokens": "1000000000000000000",
    "speedPerSec": "100000000000000000"
  }
}
```

## 🚀 Deployment

### Prerequisites
- Cloudflare account with Workers enabled
- Node.js and npm installed locally
- Wrangler CLI tool

### Step-by-Step Deployment

1. **Create New Worker Project**
   ```bash
   npm create cloudflare@latest netrum-monitor
   cd netrum-monitor
   ```

2. **Get the Source Code**
   ```bash
   # Download the worker.js file directly
   wget https://raw.githubusercontent.com/0xnightwind/netrum-mining-monitor/main/index.js   
   ```

3. **Configure Wrangler**
   ```toml
   # wrangler.toml
   name = "netrum-mining-monitor"
   main = "src/index.js"
   type = "javascript"
   compatibility_date = "2025-07-28"
   ```

4. **Deploy to Cloudflare**
   ```bash
   npx wrangler deploy
   ```

5. **Access Your Application**
   Your worker will be available at: `https://netrum-mining-monitor.your-subdomain.workers.dev`

### Environment Configuration
No environment variables required - the application uses public Netrum API endpoints.

## 💻 Usage Guide

### Basic Usage
1. Navigate to your deployed worker URL
2. Enter your Netrum node EVM address in the input field
3. Click "Check Mining" button
4. Wait approximately 30 seconds for results
5. View comprehensive mining status and activity information

### Address Format Requirements
- Must start with `0x`
- Followed by exactly 40 hexadecimal characters
- Example: `0x1234567890123456789012345678901234567890`

### Interpreting Results
- **Green Status**: Mining is active and tokens are being generated
- **Red Error**: Invalid address or API connectivity issues
- **Activity Flag**: `true` indicates active mining, `false` indicates stopped/inactive

## 🛠️ Technical Details

### Core Functions

#### `formatTokens(wei)`
Converts wei values to human-readable NPT token amounts
```javascript
function formatTokens(wei = '0') {
  return (Number(wei) / 1e18).toFixed(6);
}
```

#### `renderPage(liveStatus, miningFlag, address)`
Generates the HTML interface with dynamic content injection

### Error Handling
- **Invalid Address Format**: Immediate validation with user feedback
- **API Failures**: Graceful degradation with error messages
- **Network Issues**: Timeout handling and retry logic
- **Data Parsing**: Safe JSON parsing with fallback values

### Performance Considerations
- **Minimal Dependencies**: Pure JavaScript with no external libraries
- **Efficient API Calls**: Optimized request timing and data processing
- **Memory Management**: Proper cleanup of temporary variables
- **Response Caching**: Cloudflare edge caching for static assets

## 🔍 Troubleshooting

### Common Issues

**"Invalid EVM address" Error**
- Ensure address starts with `0x`
- Verify exactly 40 hexadecimal characters after `0x`
- Check for any extra spaces or characters

**"API Error" Messages**
- Verify the node address is registered with Netrum
- Check if the node is properly configured
- Ensure network connectivity to Netrum APIs

**Long Loading Times**
- Normal processing time is ~30 seconds
- Avoid refreshing during the monitoring period
- Check Cloudflare Worker status if delays exceed 60 seconds

### Debug Mode
For development, add console logging:
```javascript
console.log('Before tokens:', before.toString());
console.log('After tokens:', after.toString());
console.log('Mining detected:', after > before);
```

## 🔒 Security & Privacy

- **No Data Storage**: No user data is stored or logged
- **HTTPS Only**: All API communications use secure connections
- **Input Validation**: Comprehensive address validation prevents injection
- **Rate Limiting**: Cloudflare's built-in DDoS protection

## 📈 Future Enhancements

- Historical mining data tracking
- Multiple address monitoring
- Email/webhook notifications
- Performance analytics dashboard
- Mobile app integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add appropriate tests
5. Submit a pull request

## 📄 License

This project is open-source and available under the MIT License.

## 🙋‍♂️ Support

For issues related to:
- **Application bugs**: Create an issue in the repository
- **Netrum Protocol**: Contact Netrum Labs support
- **Cloudflare Workers**: Check Cloudflare documentation

---

**Built with ❤️ for the Netrum Protocol community** ⛏️

*Last updated: July 2025*

