// package com.mydev.ecommerce.shipment.service;

// import com.fasterxml.jackson.databind.JsonNode;
// import com.fasterxml.jackson.databind.ObjectMapper;
// import com.mydev.ecommerce.order.dto.UpdateShipmentRequest;
// import com.mydev.ecommerce.order.model.Order;
// import com.mydev.ecommerce.order.model.OrderItem;
// import com.mydev.ecommerce.order.model.OrderStatus;
// import com.mydev.ecommerce.order.model.PaymentMethod;
// import com.mydev.ecommerce.order.model.PaymentStatus;
// import com.mydev.ecommerce.order.repository.OrderRepository;
// import com.mydev.ecommerce.order.service.OrderService;
// import com.mydev.ecommerce.shipment.client.ShiprocketClient;
// import com.mydev.ecommerce.shipment.config.ShiprocketProperties;
// import com.mydev.ecommerce.shipment.dto.ShiprocketCreateRequest;
// import com.mydev.ecommerce.shipment.dto.ShiprocketOrderResponse;
// import com.mydev.ecommerce.shipment.model.ShiprocketOrder;
// import com.mydev.ecommerce.shipment.repository.ShiprocketOrderRepository;
// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import java.math.BigDecimal;
// import java.math.RoundingMode;
// import java.time.ZoneId;
// import java.time.format.DateTimeFormatter;
// import java.util.Iterator;
// import java.util.LinkedHashMap;
// import java.util.List;
// import java.util.Map;
// import java.util.Optional;

// @Slf4j
// @Service
// @RequiredArgsConstructor
// public class ShiprocketService {

//     private static final ZoneId INDIA_ZONE =
//             ZoneId.of("Asia/Kolkata");

//     private static final DateTimeFormatter SHIPROCKET_DATE_FORMAT =
//             DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

//     private final OrderRepository orderRepository;

//     private final ShiprocketOrderRepository shiprocketOrderRepository;

//     private final ShiprocketClient shiprocketClient;

//     private final ShiprocketProperties properties;

//     private final ObjectMapper objectMapper;

//     private final OrderService orderService;

//     @Transactional
//     public ShiprocketOrderResponse createOrContinue(
//             Long orderId,
//             ShiprocketCreateRequest request
//     ) {
//         ShiprocketCreateRequest safeRequest =
//                 request != null
//                         ? request
//                         : new ShiprocketCreateRequest(
//                         null,
//                         null,
//                         null,
//                         null,
//                         null,
//                         true,
//                         null,
//                         false
//                 );

//         Order order =
//                 orderRepository
//                         .findDetailedById(orderId)
//                         .orElseThrow(() ->
//                                 new RuntimeException(
//                                         "Order not found"
//                                 )
//                         );

//         validateOrderCanBeShipped(order);

//         ShiprocketOrder shiprocketOrder =
//                 shiprocketOrderRepository
//                         .findByOrderIdWithOrder(orderId)
//                         .orElse(null);

//         boolean hasNoRealShiprocketOrder =
//                 shiprocketOrder == null
//                         || (
//                         shiprocketOrder.getShiprocketOrderId() == null
//                                 && shiprocketOrder.getShiprocketShipmentId() == null
//                                 && isBlank(shiprocketOrder.getAwbCode())
//                 );

//         if (hasNoRealShiprocketOrder) {
//             shiprocketOrder =
//                     createShiprocketOrder(
//                             order,
//                             safeRequest
//                     );
//         }

//         boolean shouldAssignAwb =
//                 safeRequest.assignAwb() == null
//                         || safeRequest.assignAwb();

//         if (
//                 shouldAssignAwb
//                         && isBlank(shiprocketOrder.getAwbCode())
//         ) {
//             if (shiprocketOrder.getShiprocketShipmentId() == null) {
//                 shiprocketOrder.setStatus(
//                         "CREATED_MISSING_SHIPMENT_ID"
//                 );

//                 shiprocketOrderRepository.save(
//                         shiprocketOrder
//                 );

//                 throw new RuntimeException(
//                         "Shiprocket order exists but shipment_id is missing. "
//                                 + "Cannot assign AWB. Check shiprocket_orders.response_json."
//                 );
//             }

//             shiprocketOrder =
//                     assignAwb(
//                             shiprocketOrder,
//                             safeRequest.courierId()
//                     );
//         }

//         boolean shouldGeneratePickup =
//                 safeRequest.generatePickup() != null
//                         && safeRequest.generatePickup();

//         if (shouldGeneratePickup) {
//             generatePickup(
//                     shiprocketOrder
//             );
//         }

//         ShiprocketOrder loaded =
//                 reloadWithOrder(
//                         shiprocketOrder
//                 );

//         return map(
//                 loaded
//         );
//     }

//     @Transactional(readOnly = true)
//     public Optional<ShiprocketOrderResponse> findByOrderId(
//             Long orderId
//     ) {
//         return shiprocketOrderRepository
//                 .findByOrderIdWithOrder(orderId)
//                 .map(this::map);
//     }

//     private ShiprocketOrder createShiprocketOrder(
//             Order order,
//             ShiprocketCreateRequest request
//     ) {
//         Map<String, Object> payload =
//                 buildCreateOrderPayload(
//                         order,
//                         request
//                 );

//         JsonNode response =
//                 shiprocketClient
//                         .createOrder(payload);

//         Long createdShiprocketOrderId =
//                 extractShiprocketOrderId(response);

//         Long createdShipmentId =
//                 extractShipmentId(response);

//         String createdAwbCode =
//                 findTextAny(
//                         response,
//                         "awb_code",
//                         "awb"
//                 );

//         if (
//                 createdShiprocketOrderId == null
//                         && createdShipmentId == null
//                         && isBlank(createdAwbCode)
//         ) {
//             throw new RuntimeException(
//                     "Shiprocket order was not created. Response: "
//                             + toJson(response)
//             );
//         }

//         ShiprocketOrder shiprocketOrder =
//                 shiprocketOrderRepository
//                         .findByOrderIdWithOrder(order.getId())
//                         .orElseGet(ShiprocketOrder::new);

//         shiprocketOrder.setOrder(order);

//         shiprocketOrder.setShiprocketOrderId(
//                 createdShiprocketOrderId
//         );

//         shiprocketOrder.setShiprocketShipmentId(
//                 createdShipmentId
//         );

//         shiprocketOrder.setAwbCode(
//                 createdAwbCode
//         );

//         shiprocketOrder.setCourierName(
//                 findTextAny(
//                         response,
//                         "courier_name",
//                         "courier_company_name"
//                 )
//         );

//         shiprocketOrder.setCourierCompanyId(
//                 findTextAny(
//                         response,
//                         "courier_company_id"
//                 )
//         );

//         shiprocketOrder.setTrackingUrl(
//                 !isBlank(createdAwbCode)
//                         ? buildTrackingUrl(createdAwbCode)
//                         : null
//         );

//         shiprocketOrder.setStatus(
//                 safeStatus(
//                         firstNonBlank(
//                                 findDirectText(response, "status"),
//                                 findDirectText(response, "message")
//                         ),
//                         "CREATED"
//                 )
//         );

//         shiprocketOrder.setRequestJson(
//                 toJson(payload)
//         );

//         shiprocketOrder.setResponseJson(
//                 toJson(response)
//         );

//         ShiprocketOrder saved =
//                 shiprocketOrderRepository
//                         .save(shiprocketOrder);

//         saved =
//                 reloadWithOrder(saved);

//         if (!isBlank(saved.getAwbCode())) {
//             updateCustomerShipment(saved);
//         }

//         return saved;
//     }

//     private ShiprocketOrder assignAwb(
//             ShiprocketOrder shiprocketOrder,
//             Integer courierId
//     ) {
//         if (shiprocketOrder.getShiprocketShipmentId() == null) {
//             throw new RuntimeException(
//                     "Shiprocket shipment id is missing. Cannot assign AWB."
//             );
//         }

//         JsonNode response =
//                 shiprocketClient
//                         .assignAwb(
//                                 shiprocketOrder.getShiprocketShipmentId(),
//                                 courierId
//                         );

//         String awbCode =
//                 firstNonBlank(
//                         findTextAny(response, "awb_code", "awb"),
//                         shiprocketOrder.getAwbCode()
//                 );

//         if (isBlank(awbCode)) {
//             throw new RuntimeException(
//                     "Shiprocket AWB was not returned. Response: "
//                             + toJson(response)
//             );
//         }

//         shiprocketOrder.setAwbCode(
//                 awbCode
//         );

//         shiprocketOrder.setCourierName(
//                 firstNonBlank(
//                         findTextAny(
//                                 response,
//                                 "courier_name",
//                                 "courier_company_name"
//                         ),
//                         shiprocketOrder.getCourierName(),
//                         "Shiprocket"
//                 )
//         );

//         shiprocketOrder.setCourierCompanyId(
//                 firstNonBlank(
//                         findTextAny(
//                                 response,
//                                 "courier_company_id"
//                         ),
//                         shiprocketOrder.getCourierCompanyId()
//                 )
//         );

//         shiprocketOrder.setTrackingUrl(
//                 buildTrackingUrl(awbCode)
//         );

//         shiprocketOrder.setStatus(
//                 safeStatus(
//                         firstNonBlank(
//                                 findDirectText(response, "status"),
//                                 findDirectText(response, "message")
//                         ),
//                         "AWB_ASSIGNED"
//                 )
//         );

//         shiprocketOrder.setResponseJson(
//                 mergeResponseJson(
//                         shiprocketOrder.getResponseJson(),
//                         "assignAwb",
//                         response
//                 )
//         );

//         ShiprocketOrder saved =
//                 shiprocketOrderRepository
//                         .save(shiprocketOrder);

//         saved =
//                 reloadWithOrder(saved);

//         updateCustomerShipment(saved);

//         return saved;
//     }

//     private void generatePickup(
//             ShiprocketOrder shiprocketOrder
//     ) {
//         if (shiprocketOrder.getShiprocketShipmentId() == null) {
//             throw new RuntimeException(
//                     "Shiprocket shipment id is missing. Cannot generate pickup."
//             );
//         }

//         JsonNode response =
//                 shiprocketClient
//                         .generatePickup(
//                                 shiprocketOrder.getShiprocketShipmentId()
//                         );

//         shiprocketOrder.setStatus(
//                 safeStatus(
//                         firstNonBlank(
//                                 findDirectText(response, "status"),
//                                 findDirectText(response, "message")
//                         ),
//                         "PICKUP_GENERATED"
//                 )
//         );

//         shiprocketOrder.setResponseJson(
//                 mergeResponseJson(
//                         shiprocketOrder.getResponseJson(),
//                         "generatePickup",
//                         response
//                 )
//         );

//         shiprocketOrderRepository.save(
//                 shiprocketOrder
//         );
//     }

//     private void updateCustomerShipment(
//             ShiprocketOrder shiprocketOrder
//     ) {
//         String awbCode =
//                 shiprocketOrder.getAwbCode();

//         if (isBlank(awbCode)) {
//             return;
//         }

//         String courierName =
//                 firstNonBlank(
//                         shiprocketOrder.getCourierName(),
//                         "Shiprocket"
//                 );

//         courierName =
//                 trimMax(
//                         courierName,
//                         100
//                 );

//         String trackingUrl =
//                 firstNonBlank(
//                         shiprocketOrder.getTrackingUrl(),
//                         buildTrackingUrl(awbCode)
//                 );

//         Order order =
//                 shiprocketOrder.getOrder();

//         if (order == null || order.getId() == null) {
//             throw new RuntimeException(
//                     "Order is missing for Shiprocket shipment update"
//             );
//         }

//         orderService.adminUpdateShipment(
//                 order.getId(),
//                 new UpdateShipmentRequest(
//                         courierName,
//                         awbCode,
//                         trackingUrl
//                 )
//         );
//     }

//     private ShiprocketOrder reloadWithOrder(
//             ShiprocketOrder shiprocketOrder
//     ) {
//         if (
//                 shiprocketOrder == null
//                         || shiprocketOrder.getId() == null
//         ) {
//             return shiprocketOrder;
//         }

//         return shiprocketOrderRepository
//                 .findByIdWithOrder(shiprocketOrder.getId())
//                 .orElse(shiprocketOrder);
//     }

//     private void validateOrderCanBeShipped(
//             Order order
//     ) {
//         if (order.getStatus() == OrderStatus.CANCELLED) {
//             throw new RuntimeException(
//                     "Cancelled order cannot be sent to Shiprocket"
//             );
//         }

//         if (
//                 order.getItems() == null
//                         || order.getItems().isEmpty()
//         ) {
//             throw new RuntimeException(
//                     "Order has no items"
//             );
//         }

//         if (
//                 order.getPaymentMethod() == PaymentMethod.ONLINE
//                         && order.getPaymentStatus() != PaymentStatus.PAID
//         ) {
//             throw new RuntimeException(
//                     "Online order is not paid yet. Create Shiprocket shipment only after payment is PAID."
//             );
//         }
//     }

//     private Map<String, Object> buildCreateOrderPayload(
//             Order order,
//             ShiprocketCreateRequest request
//     ) {
//         Map<String, Object> payload =
//                 new LinkedHashMap<>();

//         payload.put(
//                 "order_id",
//                 safeOrderReference(order)
//         );

//         payload.put(
//                 "order_date",
//                 order.getCreatedAt()
//                         .atZoneSameInstant(INDIA_ZONE)
//                         .format(SHIPROCKET_DATE_FORMAT)
//         );

//         payload.put(
//                 "pickup_location",
//                 resolvePickupLocation(request)
//         );

//         payload.put(
//                 "billing_customer_name",
//                 required(
//                         order.getAddressFullName(),
//                         "Customer name"
//                 )
//         );

//         payload.put(
//                 "billing_last_name",
//                 ""
//         );

//         payload.put(
//                 "billing_address",
//                 required(
//                         order.getAddressLine1(),
//                         "Address line 1"
//                 )
//         );

//         payload.put(
//                 "billing_address_2",
//                 order.getAddressLine2() != null
//                         ? order.getAddressLine2()
//                         : ""
//         );

//         payload.put(
//                 "billing_city",
//                 trimMax(
//                         required(
//                                 order.getAddressCity(),
//                                 "City"
//                         ),
//                         30
//                 )
//         );

//         payload.put(
//                 "billing_pincode",
//                 onlyDigits(
//                         required(
//                                 order.getAddressPincode(),
//                                 "Pincode"
//                         )
//                 )
//         );

//         payload.put(
//                 "billing_state",
//                 required(
//                         order.getAddressState(),
//                         "State"
//                 )
//         );

//         payload.put(
//                 "billing_country",
//                 firstNonBlank(
//                         order.getAddressCountry(),
//                         "India"
//                 )
//         );

//         payload.put(
//                 "billing_email",
//                 required(
//                         order.getUser().getEmail(),
//                         "Customer email"
//                 )
//         );

//         payload.put(
//                 "billing_phone",
//                 normalizeIndianPhone(
//                         required(
//                                 order.getAddressPhone(),
//                                 "Phone"
//                         )
//                 )
//         );

//         payload.put(
//                 "shipping_is_billing",
//                 true
//         );

//         payload.put(
//                 "order_items",
//                 buildOrderItems(order)
//         );

//         payload.put(
//                 "payment_method",
//                 order.getPaymentMethod() == PaymentMethod.COD
//                         ? "COD"
//                         : "Prepaid"
//         );

//         payload.put(
//                 "shipping_charges",
//                 rupees(order.getShippingAmount())
//         );

//         payload.put(
//                 "giftwrap_charges",
//                 0
//         );

//         payload.put(
//                 "transaction_charges",
//                 0
//         );

//         payload.put(
//                 "total_discount",
//                 rupees(order.getDiscountAmount())
//         );

//         payload.put(
//                 "sub_total",
//                 rupees(order.getTotalAmount())
//         );

//         payload.put(
//                 "length",
//                 packageValue(
//                         request.lengthCm(),
//                         properties.getDefaultLengthCm(),
//                         "length",
//                         new BigDecimal("0.50")
//                 )
//         );

//         payload.put(
//                 "breadth",
//                 packageValue(
//                         request.breadthCm(),
//                         properties.getDefaultBreadthCm(),
//                         "breadth",
//                         new BigDecimal("0.50")
//                 )
//         );

//         payload.put(
//                 "height",
//                 packageValue(
//                         request.heightCm(),
//                         properties.getDefaultHeightCm(),
//                         "height",
//                         new BigDecimal("0.50")
//                 )
//         );

//         payload.put(
//                 "weight",
//                 packageValue(
//                         request.weightKg(),
//                         properties.getDefaultWeightKg(),
//                         "weight",
//                         BigDecimal.ZERO
//                 )
//         );

//         return payload;
//     }

//     private String resolvePickupLocation(
//             ShiprocketCreateRequest request
//     ) {
//         String pickupLocation =
//                 firstNonBlank(
//                         request.pickupLocation(),
//                         properties.getPickupLocation(),
//                         "warehouse"
//                 );

//         if (
//                 pickupLocation.equalsIgnoreCase("primary")
//         ) {
//             return "warehouse";
//         }

//         return pickupLocation;
//     }

//     private List<Map<String, Object>> buildOrderItems(
//             Order order
//     ) {
//         return order
//                 .getItems()
//                 .stream()
//                 .map(this::buildOrderItem)
//                 .toList();
//     }

//     private Map<String, Object> buildOrderItem(
//             OrderItem item
//     ) {
//         Map<String, Object> payload =
//                 new LinkedHashMap<>();

//         payload.put(
//                 "name",
//                 trimMax(
//                         required(
//                                 item.getProductTitle(),
//                                 "Product title"
//                         ),
//                         200
//                 )
//         );

//         payload.put(
//                 "sku",
//                 item.getProduct() != null
//                         && item.getProduct().getId() != null
//                         ? "PROD-" + item.getProduct().getId()
//                         : "ITEM-" + item.getId()
//         );

//         payload.put(
//                 "units",
//                 item.getQuantity()
//         );

//         payload.put(
//                 "selling_price",
//                 rupees(item.getUnitPrice())
//         );

//         return payload;
//     }

//     private ShiprocketOrderResponse map(
//             ShiprocketOrder shiprocketOrder
//     ) {
//         Order order =
//                 shiprocketOrder.getOrder();

//         Long orderId =
//                 order != null
//                         ? order.getId()
//                         : null;

//         String orderNumber =
//                 order != null
//                         ? order.getOrderNumber()
//                         : null;

//         return new ShiprocketOrderResponse(
//                 shiprocketOrder.getId(),
//                 orderId,
//                 orderNumber,
//                 shiprocketOrder.getShiprocketOrderId(),
//                 shiprocketOrder.getShiprocketShipmentId(),
//                 shiprocketOrder.getAwbCode(),
//                 shiprocketOrder.getCourierName(),
//                 shiprocketOrder.getCourierCompanyId(),
//                 shiprocketOrder.getTrackingUrl(),
//                 shiprocketOrder.getStatus(),
//                 shiprocketOrder.getCreatedAt(),
//                 shiprocketOrder.getUpdatedAt()
//         );
//     }

//     private String safeOrderReference(
//             Order order
//     ) {
//         String value =
//                 firstNonBlank(
//                         order.getOrderNumber(),
//                         "ORDER-" + order.getId()
//                 );

//         return trimMax(
//                 value,
//                 50
//         );
//     }

//     private String buildTrackingUrl(
//             String awbCode
//     ) {
//         String base =
//                 properties.getTrackingBaseUrl();

//         if (isBlank(base)) {
//             return null;
//         }

//         base =
//                 base.trim();

//         if (base.endsWith("/")) {
//             return base + awbCode;
//         }

//         return base + "/" + awbCode;
//     }

//     private int rupees(
//             BigDecimal value
//     ) {
//         if (value == null) {
//             return 0;
//         }

//         return value
//                 .setScale(0, RoundingMode.HALF_UP)
//                 .intValue();
//     }

//     private BigDecimal packageValue(
//             BigDecimal requestValue,
//             BigDecimal defaultValue,
//             String fieldName,
//             BigDecimal minExclusive
//     ) {
//         BigDecimal value =
//                 requestValue != null
//                         ? requestValue
//                         : defaultValue;

//         if (value == null) {
//             throw new RuntimeException(
//                     "Package " + fieldName + " is missing"
//             );
//         }

//         if (value.compareTo(minExclusive) <= 0) {
//             throw new RuntimeException(
//                     "Package "
//                             + fieldName
//                             + " must be greater than "
//                             + minExclusive
//             );
//         }

//         return value;
//     }

//     private String normalizeIndianPhone(
//             String value
//     ) {
//         String digits =
//                 onlyDigits(value);

//         if (digits.length() > 10) {
//             digits =
//                     digits.substring(
//                             digits.length() - 10
//                     );
//         }

//         if (digits.length() != 10) {
//             throw new RuntimeException(
//                     "Phone number must contain 10 digits"
//             );
//         }

//         return digits;
//     }

//     private String onlyDigits(
//             String value
//     ) {
//         return value
//                 .replaceAll("[^0-9]", "");
//     }

//     private String required(
//             String value,
//             String fieldName
//     ) {
//         if (isBlank(value)) {
//             throw new RuntimeException(
//                     fieldName + " is required"
//             );
//         }

//         return value.trim();
//     }

//     private String trimMax(
//             String value,
//             int max
//     ) {
//         if (value == null) {
//             return null;
//         }

//         String trimmed =
//                 value.trim();

//         if (trimmed.length() <= max) {
//             return trimmed;
//         }

//         return trimmed.substring(0, max);
//     }

//     private String firstNonBlank(
//             String... values
//     ) {
//         if (values == null) {
//             return null;
//         }

//         for (String value : values) {
//             if (!isBlank(value)) {
//                 return value.trim();
//             }
//         }

//         return null;
//     }

//     private boolean isBlank(
//             String value
//     ) {
//         return value == null
//                 || value.isBlank();
//     }

//     private String safeStatus(
//             String value,
//             String fallback
//     ) {
//         return trimMax(
//                 firstNonBlank(
//                         value,
//                         fallback
//                 ),
//                 80
//         );
//     }

//     private Long extractShiprocketOrderId(
//             JsonNode response
//     ) {
//         return findLongAny(
//                 response,
//                 "order_id",
//                 "shiprocket_order_id"
//         );
//     }

//     private Long extractShipmentId(
//             JsonNode response
//     ) {
//         Long direct =
//                 findLongAny(
//                         response,
//                         "shipment_id",
//                         "shiprocket_shipment_id",
//                         "shipmentId"
//                 );

//         if (direct != null) {
//             return direct;
//         }

//         JsonNode shipmentNode =
//                 findNode(
//                         response,
//                         "shipment"
//                 );

//         if (shipmentNode != null) {
//             Long fromShipment =
//                     findLongAny(
//                             shipmentNode,
//                             "id",
//                             "shipment_id",
//                             "shipmentId"
//                     );

//             if (fromShipment != null) {
//                 return fromShipment;
//             }
//         }

//         JsonNode shipmentsNode =
//                 findNode(
//                         response,
//                         "shipments"
//                 );

//         if (
//                 shipmentsNode != null
//                         && shipmentsNode.isArray()
//                         && shipmentsNode.size() > 0
//         ) {
//             return findLongAny(
//                     shipmentsNode.get(0),
//                     "id",
//                     "shipment_id",
//                     "shipmentId"
//             );
//         }

//         return null;
//     }

//     private Long findLongAny(
//             JsonNode root,
//             String... fieldNames
//     ) {
//         if (fieldNames == null) {
//             return null;
//         }

//         for (String fieldName : fieldNames) {
//             Long value =
//                     findLong(
//                             root,
//                             fieldName
//                     );

//             if (value != null) {
//                 return value;
//             }
//         }

//         return null;
//     }

//     private String findTextAny(
//             JsonNode root,
//             String... fieldNames
//     ) {
//         if (fieldNames == null) {
//             return null;
//         }

//         for (String fieldName : fieldNames) {
//             String value =
//                     findText(
//                             root,
//                             fieldName
//                     );

//             if (!isBlank(value)) {
//                 return value;
//             }
//         }

//         return null;
//     }

//     private Long findLong(
//             JsonNode root,
//             String fieldName
//     ) {
//         String text =
//                 findText(
//                         root,
//                         fieldName
//                 );

//         if (isBlank(text)) {
//             return null;
//         }

//         try {
//             return Long.valueOf(text);

//         } catch (NumberFormatException exception) {
//             return null;
//         }
//     }

//     private String findDirectText(
//             JsonNode root,
//             String fieldName
//     ) {
//         if (
//                 root == null
//                         || fieldName == null
//                         || !root.isObject()
//                         || !root.hasNonNull(fieldName)
//         ) {
//             return null;
//         }

//         return root
//                 .get(fieldName)
//                 .asText();
//     }

//     private String findText(
//             JsonNode root,
//             String fieldName
//     ) {
//         if (
//                 root == null
//                         || fieldName == null
//         ) {
//             return null;
//         }

//         if (
//                 root.isObject()
//                         && root.hasNonNull(fieldName)
//         ) {
//             return root
//                     .get(fieldName)
//                     .asText();
//         }

//         if (root.isObject()) {
//             Iterator<JsonNode> children =
//                     root.elements();

//             while (children.hasNext()) {
//                 String value =
//                         findText(
//                                 children.next(),
//                                 fieldName
//                         );

//                 if (!isBlank(value)) {
//                     return value;
//                 }
//             }
//         }

//         if (root.isArray()) {
//             for (JsonNode child : root) {
//                 String value =
//                         findText(
//                                 child,
//                                 fieldName
//                         );

//                 if (!isBlank(value)) {
//                     return value;
//                 }
//             }
//         }

//         return null;
//     }

//     private JsonNode findNode(
//             JsonNode root,
//             String fieldName
//     ) {
//         if (
//                 root == null
//                         || fieldName == null
//         ) {
//             return null;
//         }

//         if (
//                 root.isObject()
//                         && root.hasNonNull(fieldName)
//         ) {
//             return root.get(fieldName);
//         }

//         if (root.isObject()) {
//             Iterator<JsonNode> children =
//                     root.elements();

//             while (children.hasNext()) {
//                 JsonNode found =
//                         findNode(
//                                 children.next(),
//                                 fieldName
//                         );

//                 if (found != null) {
//                     return found;
//                 }
//             }
//         }

//         if (root.isArray()) {
//             for (JsonNode child : root) {
//                 JsonNode found =
//                         findNode(
//                                 child,
//                                 fieldName
//                         );

//                 if (found != null) {
//                     return found;
//                 }
//             }
//         }

//         return null;
//     }

//     private String toJson(
//             Object value
//     ) {
//         try {
//             return objectMapper
//                     .writeValueAsString(value);

//         } catch (Exception exception) {
//             return String.valueOf(value);
//         }
//     }

//     private String mergeResponseJson(
//             String existingJson,
//             String key,
//             JsonNode response
//     ) {
//         Map<String, Object> merged =
//                 new LinkedHashMap<>();

//         if (!isBlank(existingJson)) {
//             merged.put(
//                     "previous",
//                     existingJson
//             );
//         }

//         merged.put(
//                 key,
//                 response
//         );

//         return toJson(merged);
//     }
// }

















































package com.mydev.ecommerce.shipment.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mydev.ecommerce.order.dto.UpdateShipmentRequest;
import com.mydev.ecommerce.order.model.Order;
import com.mydev.ecommerce.order.model.OrderItem;
import com.mydev.ecommerce.order.model.OrderStatus;
import com.mydev.ecommerce.order.model.PaymentMethod;
import com.mydev.ecommerce.order.model.PaymentStatus;
import com.mydev.ecommerce.order.repository.OrderRepository;
import com.mydev.ecommerce.order.service.OrderService;
import com.mydev.ecommerce.shipment.client.ShiprocketClient;
import com.mydev.ecommerce.shipment.config.ShiprocketProperties;
import com.mydev.ecommerce.shipment.dto.ShiprocketCreateRequest;
import com.mydev.ecommerce.shipment.dto.ShiprocketOrderResponse;
import com.mydev.ecommerce.shipment.model.ShiprocketOrder;
import com.mydev.ecommerce.shipment.repository.ShiprocketOrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ShiprocketService {

    private static final ZoneId INDIA_ZONE =
            ZoneId.of("Asia/Kolkata");

    private static final DateTimeFormatter SHIPROCKET_DATE_FORMAT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private final OrderRepository orderRepository;

    private final ShiprocketOrderRepository shiprocketOrderRepository;

    private final ShiprocketClient shiprocketClient;

    private final ShiprocketProperties properties;

    private final ObjectMapper objectMapper;

    private final OrderService orderService;

    @Transactional
    public ShiprocketOrderResponse createOrContinue(
            Long orderId,
            ShiprocketCreateRequest request
    ) {
        ShiprocketCreateRequest safeRequest =
                request != null
                        ? request
                        : new ShiprocketCreateRequest(
                        null,
                        null,
                        null,
                        null,
                        null,
                        true,
                        null,
                        false
                );

        Order order =
                orderRepository
                        .findDetailedById(orderId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found"
                                )
                        );

        validateOrderCanBeShipped(order);

        ShiprocketOrder shiprocketOrder =
                shiprocketOrderRepository
                        .findByOrderIdWithOrder(orderId)
                        .orElse(null);

        boolean hasNoRealShiprocketOrder =
                shiprocketOrder == null
                        || (
                        shiprocketOrder.getShiprocketOrderId() == null
                                && shiprocketOrder.getShiprocketShipmentId() == null
                                && isBlank(shiprocketOrder.getAwbCode())
                );

        if (hasNoRealShiprocketOrder) {
            shiprocketOrder =
                    createShiprocketOrder(
                            order,
                            safeRequest
                    );
        }

        boolean shouldAssignAwb =
                safeRequest.assignAwb() == null
                        || safeRequest.assignAwb();

        if (
                shouldAssignAwb
                        && isBlank(shiprocketOrder.getAwbCode())
        ) {
            if (shiprocketOrder.getShiprocketShipmentId() == null) {
                shiprocketOrder.setStatus(
                        "CREATED_MISSING_SHIPMENT_ID"
                );

                shiprocketOrderRepository.save(
                        shiprocketOrder
                );

                throw new RuntimeException(
                        "Shiprocket order exists but shipment_id is missing. "
                                + "Cannot assign AWB. Check shiprocket_orders.response_json."
                );
            }

            shiprocketOrder =
                    assignAwb(
                            shiprocketOrder,
                            safeRequest.courierId()
                    );
        }

        boolean shouldGeneratePickup =
                safeRequest.generatePickup() != null
                        && safeRequest.generatePickup();

        if (shouldGeneratePickup) {
            generatePickup(
                    shiprocketOrder
            );
        }

        ShiprocketOrder loaded =
                reloadWithOrder(
                        shiprocketOrder
                );

        return map(
                loaded
        );
    }

    @Transactional(readOnly = true)
    public Optional<ShiprocketOrderResponse> findByOrderId(
            Long orderId
    ) {
        return shiprocketOrderRepository
                .findByOrderIdWithOrder(orderId)
                .map(this::map);
    }

    @Transactional
    public Optional<ShiprocketOrderResponse> processTrackingWebhook(
            JsonNode payload,
            String signature
    ) {
        if (payload == null || payload.isNull()) {
            log.warn(
                    "Shiprocket webhook payload is empty"
            );

            return Optional.empty();
        }

        Optional<ShiprocketOrder> optionalShiprocketOrder =
                findMatchingShiprocketOrder(payload);

        if (optionalShiprocketOrder.isEmpty()) {
            log.warn(
                    "No matching Shiprocket order found for webhook payload: {}",
                    toJson(payload)
            );

            return Optional.empty();
        }

        ShiprocketOrder saved =
                applyTrackingPayload(
                        optionalShiprocketOrder.get(),
                        payload,
                        "trackingWebhook"
                );

        return Optional.of(
                map(saved)
        );
    }

    @Transactional
    public ShiprocketOrderResponse refreshTrackingByOrderId(
            Long orderId
    ) {
        ShiprocketOrder shiprocketOrder =
                shiprocketOrderRepository
                        .findByOrderIdWithOrder(orderId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Shiprocket order not found for order id: " + orderId
                                )
                        );

        ShiprocketOrder saved =
                refreshTrackingEntity(
                        shiprocketOrder,
                        "adminSingleRefresh"
                );

        return map(
                saved
        );
    }

    @Transactional
    public int refreshOpenShipmentsFromAdmin() {
        return refreshOpenShipments(
                "adminBulkRefresh"
        );
    }

    @Transactional
    public int refreshOpenShipmentsFromScheduler() {
        return refreshOpenShipments(
                "schedulerRefresh"
        );
    }

    private int refreshOpenShipments(
            String source
    ) {
        List<ShiprocketOrder> candidates =
                shiprocketOrderRepository
                        .findAll()
                        .stream()
                        .filter(this::shouldRefreshTracking)
                        .toList();

        int updated = 0;
        int failed = 0;

        for (ShiprocketOrder shiprocketOrder : candidates) {
            try {
                refreshTrackingEntity(
                        shiprocketOrder,
                        source
                );

                updated++;

            } catch (Exception exception) {
                failed++;

                log.warn(
                        "Shiprocket tracking refresh failed. source={}, shiprocketOrderLocalId={}, awb={}, reason={}",
                        source,
                        shiprocketOrder.getId(),
                        shiprocketOrder.getAwbCode(),
                        exception.getMessage()
                );
            }
        }

        log.info(
                "Shiprocket tracking refresh completed. source={}, checked={}, updated={}, failed={}",
                source,
                candidates.size(),
                updated,
                failed
        );

        return updated;
    }

    private ShiprocketOrder refreshTrackingEntity(
            ShiprocketOrder shiprocketOrder,
            String responseKey
    ) {
        ShiprocketOrder loaded =
                reloadWithOrder(shiprocketOrder);

        JsonNode response =
                fetchTrackingFromShiprocket(loaded);

        return applyTrackingPayload(
                loaded,
                response,
                responseKey
        );
    }

    private JsonNode fetchTrackingFromShiprocket(
            ShiprocketOrder shiprocketOrder
    ) {
        String awbCode =
                shiprocketOrder.getAwbCode();

        if (!isBlank(awbCode)) {
            List<String> awbMethodNames =
                    List.of(
                            "trackByAwb",
                            "trackByAwbCode",
                            "trackShipmentByAwb",
                            "getTrackingByAwb",
                            "getTrackingByAwbCode"
                    );

            for (String methodName : awbMethodNames) {
                Optional<JsonNode> response =
                        tryInvokeClientJsonMethod(
                                methodName,
                                String.class,
                                awbCode
                        );

                if (response.isPresent()) {
                    return response.get();
                }
            }
        }

        Long shipmentId =
                shiprocketOrder.getShiprocketShipmentId();

        if (shipmentId != null) {
            List<String> shipmentMethodNames =
                    List.of(
                            "trackByShipmentId",
                            "trackShipmentByShipmentId",
                            "getTrackingByShipmentId",
                            "getShipmentTracking"
                    );

            for (String methodName : shipmentMethodNames) {
                Optional<JsonNode> response =
                        tryInvokeClientJsonMethod(
                                methodName,
                                Long.class,
                                shipmentId
                        );

                if (response.isPresent()) {
                    return response.get();
                }
            }
        }

        throw new RuntimeException(
                "No tracking method found in ShiprocketClient. "
                        + "Add trackByAwb(String awbCode) in ShiprocketClient."
        );
    }

    private Optional<JsonNode> tryInvokeClientJsonMethod(
            String methodName,
            Class<?> parameterType,
            Object argument
    ) {
        try {
            Method method =
                    shiprocketClient
                            .getClass()
                            .getMethod(
                                    methodName,
                                    parameterType
                            );

            Object result =
                    method.invoke(
                            shiprocketClient,
                            argument
                    );

            if (result == null) {
                return Optional.empty();
            }

            if (result instanceof JsonNode jsonNode) {
                return Optional.of(
                        jsonNode
                );
            }

            if (result instanceof String text) {
                return Optional.of(
                        objectMapper.readTree(text)
                );
            }

            return Optional.of(
                    objectMapper.valueToTree(result)
            );

        } catch (NoSuchMethodException exception) {
            return Optional.empty();

        } catch (Exception exception) {
            throw new RuntimeException(
                    "Shiprocket tracking API call failed using method "
                            + methodName
                            + ": "
                            + exception.getMessage(),
                    exception
            );
        }
    }

    private ShiprocketOrder applyTrackingPayload(
            ShiprocketOrder shiprocketOrder,
            JsonNode payload,
            String responseKey
    ) {
        String awbCode =
                firstNonBlank(
                        findTextAny(
                                payload,
                                "awb_code",
                                "awb",
                                "awbCode"
                        ),
                        shiprocketOrder.getAwbCode()
                );

        if (!isBlank(awbCode)) {
            shiprocketOrder.setAwbCode(
                    awbCode
            );

            shiprocketOrder.setTrackingUrl(
                    firstNonBlank(
                            findTextAny(
                                    payload,
                                    "tracking_url",
                                    "track_url",
                                    "trackingUrl"
                            ),
                            shiprocketOrder.getTrackingUrl(),
                            buildTrackingUrl(awbCode)
                    )
            );
        }

        shiprocketOrder.setCourierName(
                firstNonBlank(
                        findTextAny(
                                payload,
                                "courier_name",
                                "courier_company_name",
                                "courier"
                        ),
                        shiprocketOrder.getCourierName(),
                        "Shiprocket"
                )
        );

        shiprocketOrder.setCourierCompanyId(
                firstNonBlank(
                        findTextAny(
                                payload,
                                "courier_company_id",
                                "courier_id"
                        ),
                        shiprocketOrder.getCourierCompanyId()
                )
        );

        shiprocketOrder.setStatus(
                safeStatus(
                        extractTrackingStatus(payload),
                        "TRACKING_UPDATED"
                )
        );

        shiprocketOrder.setResponseJson(
                mergeResponseJson(
                        shiprocketOrder.getResponseJson(),
                        responseKey,
                        payload
                )
        );

        ShiprocketOrder saved =
                shiprocketOrderRepository
                        .save(shiprocketOrder);

        saved =
                reloadWithOrder(saved);

        if (!isBlank(saved.getAwbCode())) {
            updateCustomerShipment(saved);
        }

        updateOrderStatusFromTracking(
                saved,
                payload
        );

        return saved;
    }

    private void updateOrderStatusFromTracking(
            ShiprocketOrder shiprocketOrder,
            JsonNode payload
    ) {
        if (
                shiprocketOrder == null
                        || shiprocketOrder.getOrder() == null
        ) {
            return;
        }

        String trackingStatus =
                firstNonBlank(
                        extractTrackingStatus(payload),
                        shiprocketOrder.getStatus()
                );

        if (isBlank(trackingStatus)) {
            return;
        }

        String normalized =
                trackingStatus
                        .toLowerCase()
                        .trim();

        String targetStatusName = null;

        if (
                normalized.contains("delivered")
                        || normalized.equals("delivered")
        ) {
            targetStatusName = "DELIVERED";

        } else if (
                normalized.contains("out for delivery")
                        || normalized.contains("ofd")
        ) {
            targetStatusName = "OUT_FOR_DELIVERY";

        } else if (
                normalized.contains("picked")
                        || normalized.contains("pickup")
                        || normalized.contains("in transit")
                        || normalized.contains("shipped")
                        || normalized.contains("manifested")
        ) {
            targetStatusName = "SHIPPED";

        } else if (
                normalized.contains("cancel")
        ) {
            targetStatusName = "CANCELLED";
        }

        if (isBlank(targetStatusName)) {
            return;
        }

        try {
            OrderStatus targetStatus =
                    OrderStatus.valueOf(
                            targetStatusName
                    );

            Order order =
                    shiprocketOrder.getOrder();

            if (order.getStatus() == targetStatus) {
                return;
            }

            Method setStatusMethod =
                    order
                            .getClass()
                            .getMethod(
                                    "setStatus",
                                    OrderStatus.class
                            );

            setStatusMethod.invoke(
                    order,
                    targetStatus
            );

            orderRepository.save(
                    order
            );

            log.info(
                    "Order status updated from Shiprocket tracking. orderId={}, status={}",
                    order.getId(),
                    targetStatus
            );

        } catch (IllegalArgumentException exception) {
            log.warn(
                    "OrderStatus enum does not contain {}. Skipping automatic status update.",
                    targetStatusName
            );

        } catch (Exception exception) {
            log.warn(
                    "Could not update order status from Shiprocket tracking. shiprocketOrderLocalId={}, reason={}",
                    shiprocketOrder.getId(),
                    exception.getMessage()
            );
        }
    }

    private Optional<ShiprocketOrder> findMatchingShiprocketOrder(
            JsonNode payload
    ) {
        String awbCode =
                findTextAny(
                        payload,
                        "awb_code",
                        "awb",
                        "awbCode"
                );

        Long shipmentId =
                findLongAny(
                        payload,
                        "shipment_id",
                        "shipmentId",
                        "shiprocket_shipment_id"
                );

        Long shiprocketOrderId =
                findLongAny(
                        payload,
                        "order_id",
                        "shiprocket_order_id"
                );

        String orderNumber =
                findTextAny(
                        payload,
                        "channel_order_id",
                        "order_number",
                        "order_no",
                        "order_id"
                );

        return shiprocketOrderRepository
                .findAll()
                .stream()
                .filter(existing ->
                        matchesShiprocketOrder(
                                existing,
                                awbCode,
                                shipmentId,
                                shiprocketOrderId,
                                orderNumber
                        )
                )
                .findFirst();
    }

    private boolean matchesShiprocketOrder(
            ShiprocketOrder existing,
            String awbCode,
            Long shipmentId,
            Long shiprocketOrderId,
            String orderNumber
    ) {
        if (
                !isBlank(awbCode)
                        && !isBlank(existing.getAwbCode())
                        && awbCode.equalsIgnoreCase(existing.getAwbCode())
        ) {
            return true;
        }

        if (
                shipmentId != null
                        && existing.getShiprocketShipmentId() != null
                        && shipmentId.equals(existing.getShiprocketShipmentId())
        ) {
            return true;
        }

        if (
                shiprocketOrderId != null
                        && existing.getShiprocketOrderId() != null
                        && shiprocketOrderId.equals(existing.getShiprocketOrderId())
        ) {
            return true;
        }

        Order order =
                existing.getOrder();

        return order != null
                && !isBlank(orderNumber)
                && !isBlank(order.getOrderNumber())
                && orderNumber.equalsIgnoreCase(order.getOrderNumber());
    }

    private boolean shouldRefreshTracking(
            ShiprocketOrder shiprocketOrder
    ) {
        if (shiprocketOrder == null) {
            return false;
        }

        if (
                isBlank(shiprocketOrder.getAwbCode())
                        && shiprocketOrder.getShiprocketShipmentId() == null
        ) {
            return false;
        }

        String status =
                shiprocketOrder.getStatus();

        if (isBlank(status)) {
            return true;
        }

        String lower =
                status.toLowerCase();

        return !lower.contains("delivered")
                && !lower.contains("cancel")
                && !lower.contains("rto")
                && !lower.contains("return")
                && !lower.contains("lost");
    }

    private ShiprocketOrder createShiprocketOrder(
            Order order,
            ShiprocketCreateRequest request
    ) {
        Map<String, Object> payload =
                buildCreateOrderPayload(
                        order,
                        request
                );

        JsonNode response =
                shiprocketClient
                        .createOrder(payload);

        Long createdShiprocketOrderId =
                extractShiprocketOrderId(response);

        Long createdShipmentId =
                extractShipmentId(response);

        String createdAwbCode =
                findTextAny(
                        response,
                        "awb_code",
                        "awb"
                );

        if (
                createdShiprocketOrderId == null
                        && createdShipmentId == null
                        && isBlank(createdAwbCode)
        ) {
            throw new RuntimeException(
                    "Shiprocket order was not created. Response: "
                            + toJson(response)
            );
        }

        ShiprocketOrder shiprocketOrder =
                shiprocketOrderRepository
                        .findByOrderIdWithOrder(order.getId())
                        .orElseGet(ShiprocketOrder::new);

        shiprocketOrder.setOrder(order);

        shiprocketOrder.setShiprocketOrderId(
                createdShiprocketOrderId
        );

        shiprocketOrder.setShiprocketShipmentId(
                createdShipmentId
        );

        shiprocketOrder.setAwbCode(
                createdAwbCode
        );

        shiprocketOrder.setCourierName(
                findTextAny(
                        response,
                        "courier_name",
                        "courier_company_name"
                )
        );

        shiprocketOrder.setCourierCompanyId(
                findTextAny(
                        response,
                        "courier_company_id"
                )
        );

        shiprocketOrder.setTrackingUrl(
                !isBlank(createdAwbCode)
                        ? buildTrackingUrl(createdAwbCode)
                        : null
        );

        shiprocketOrder.setStatus(
                safeStatus(
                        firstNonBlank(
                                findDirectText(response, "status"),
                                findDirectText(response, "message")
                        ),
                        "CREATED"
                )
        );

        shiprocketOrder.setRequestJson(
                toJson(payload)
        );

        shiprocketOrder.setResponseJson(
                toJson(response)
        );

        ShiprocketOrder saved =
                shiprocketOrderRepository
                        .save(shiprocketOrder);

        saved =
                reloadWithOrder(saved);

        if (!isBlank(saved.getAwbCode())) {
            updateCustomerShipment(saved);
        }

        return saved;
    }

    private ShiprocketOrder assignAwb(
            ShiprocketOrder shiprocketOrder,
            Integer courierId
    ) {
        if (shiprocketOrder.getShiprocketShipmentId() == null) {
            throw new RuntimeException(
                    "Shiprocket shipment id is missing. Cannot assign AWB."
            );
        }

        JsonNode response =
                shiprocketClient
                        .assignAwb(
                                shiprocketOrder.getShiprocketShipmentId(),
                                courierId
                        );

        String awbCode =
                firstNonBlank(
                        findTextAny(response, "awb_code", "awb"),
                        shiprocketOrder.getAwbCode()
                );

        if (isBlank(awbCode)) {
            throw new RuntimeException(
                    "Shiprocket AWB was not returned. Response: "
                            + toJson(response)
            );
        }

        shiprocketOrder.setAwbCode(
                awbCode
        );

        shiprocketOrder.setCourierName(
                firstNonBlank(
                        findTextAny(
                                response,
                                "courier_name",
                                "courier_company_name"
                        ),
                        shiprocketOrder.getCourierName(),
                        "Shiprocket"
                )
        );

        shiprocketOrder.setCourierCompanyId(
                firstNonBlank(
                        findTextAny(
                                response,
                                "courier_company_id"
                        ),
                        shiprocketOrder.getCourierCompanyId()
                )
        );

        shiprocketOrder.setTrackingUrl(
                buildTrackingUrl(awbCode)
        );

        shiprocketOrder.setStatus(
                safeStatus(
                        firstNonBlank(
                                findDirectText(response, "status"),
                                findDirectText(response, "message")
                        ),
                        "AWB_ASSIGNED"
                )
        );

        shiprocketOrder.setResponseJson(
                mergeResponseJson(
                        shiprocketOrder.getResponseJson(),
                        "assignAwb",
                        response
                )
        );

        ShiprocketOrder saved =
                shiprocketOrderRepository
                        .save(shiprocketOrder);

        saved =
                reloadWithOrder(saved);

        updateCustomerShipment(saved);

        return saved;
    }

    private void generatePickup(
            ShiprocketOrder shiprocketOrder
    ) {
        if (shiprocketOrder.getShiprocketShipmentId() == null) {
            throw new RuntimeException(
                    "Shiprocket shipment id is missing. Cannot generate pickup."
            );
        }

        JsonNode response =
                shiprocketClient
                        .generatePickup(
                                shiprocketOrder.getShiprocketShipmentId()
                        );

        shiprocketOrder.setStatus(
                safeStatus(
                        firstNonBlank(
                                findDirectText(response, "status"),
                                findDirectText(response, "message")
                        ),
                        "PICKUP_GENERATED"
                )
        );

        shiprocketOrder.setResponseJson(
                mergeResponseJson(
                        shiprocketOrder.getResponseJson(),
                        "generatePickup",
                        response
                )
        );

        shiprocketOrderRepository.save(
                shiprocketOrder
        );
    }

    private void updateCustomerShipment(
            ShiprocketOrder shiprocketOrder
    ) {
        String awbCode =
                shiprocketOrder.getAwbCode();

        if (isBlank(awbCode)) {
            return;
        }

        String courierName =
                firstNonBlank(
                        shiprocketOrder.getCourierName(),
                        "Shiprocket"
                );

        courierName =
                trimMax(
                        courierName,
                        100
                );

        String trackingUrl =
                firstNonBlank(
                        shiprocketOrder.getTrackingUrl(),
                        buildTrackingUrl(awbCode)
                );

        Order order =
                shiprocketOrder.getOrder();

        if (order == null || order.getId() == null) {
            throw new RuntimeException(
                    "Order is missing for Shiprocket shipment update"
            );
        }

        orderService.adminUpdateShipment(
                order.getId(),
                new UpdateShipmentRequest(
                        courierName,
                        awbCode,
                        trackingUrl
                )
        );
    }

    private ShiprocketOrder reloadWithOrder(
            ShiprocketOrder shiprocketOrder
    ) {
        if (
                shiprocketOrder == null
                        || shiprocketOrder.getId() == null
        ) {
            return shiprocketOrder;
        }

        return shiprocketOrderRepository
                .findByIdWithOrder(shiprocketOrder.getId())
                .orElse(shiprocketOrder);
    }

    private void validateOrderCanBeShipped(
            Order order
    ) {
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException(
                    "Cancelled order cannot be sent to Shiprocket"
            );
        }

        if (
                order.getItems() == null
                        || order.getItems().isEmpty()
        ) {
            throw new RuntimeException(
                    "Order has no items"
            );
        }

        if (
                order.getPaymentMethod() == PaymentMethod.ONLINE
                        && order.getPaymentStatus() != PaymentStatus.PAID
        ) {
            throw new RuntimeException(
                    "Online order is not paid yet. Create Shiprocket shipment only after payment is PAID."
            );
        }
    }

    private Map<String, Object> buildCreateOrderPayload(
            Order order,
            ShiprocketCreateRequest request
    ) {
        Map<String, Object> payload =
                new LinkedHashMap<>();

        payload.put(
                "order_id",
                safeOrderReference(order)
        );

        payload.put(
                "order_date",
                order.getCreatedAt()
                        .atZoneSameInstant(INDIA_ZONE)
                        .format(SHIPROCKET_DATE_FORMAT)
        );

        payload.put(
                "pickup_location",
                resolvePickupLocation(request)
        );

        payload.put(
                "billing_customer_name",
                required(
                        order.getAddressFullName(),
                        "Customer name"
                )
        );

        payload.put(
                "billing_last_name",
                ""
        );

        payload.put(
                "billing_address",
                required(
                        order.getAddressLine1(),
                        "Address line 1"
                )
        );

        payload.put(
                "billing_address_2",
                order.getAddressLine2() != null
                        ? order.getAddressLine2()
                        : ""
        );

        payload.put(
                "billing_city",
                trimMax(
                        required(
                                order.getAddressCity(),
                                "City"
                        ),
                        30
                )
        );

        payload.put(
                "billing_pincode",
                onlyDigits(
                        required(
                                order.getAddressPincode(),
                                "Pincode"
                        )
                )
        );

        payload.put(
                "billing_state",
                required(
                        order.getAddressState(),
                        "State"
                )
        );

        payload.put(
                "billing_country",
                firstNonBlank(
                        order.getAddressCountry(),
                        "India"
                )
        );

        payload.put(
                "billing_email",
                required(
                        order.getUser().getEmail(),
                        "Customer email"
                )
        );

        payload.put(
                "billing_phone",
                normalizeIndianPhone(
                        required(
                                order.getAddressPhone(),
                                "Phone"
                        )
                )
        );

        payload.put(
                "shipping_is_billing",
                true
        );

        payload.put(
                "order_items",
                buildOrderItems(order)
        );

        payload.put(
                "payment_method",
                order.getPaymentMethod() == PaymentMethod.COD
                        ? "COD"
                        : "Prepaid"
        );

        payload.put(
                "shipping_charges",
                rupees(order.getShippingAmount())
        );

        payload.put(
                "giftwrap_charges",
                0
        );

        payload.put(
                "transaction_charges",
                0
        );

        payload.put(
                "total_discount",
                rupees(order.getDiscountAmount())
        );

        payload.put(
                "sub_total",
                rupees(order.getTotalAmount())
        );

        payload.put(
                "length",
                packageValue(
                        request.lengthCm(),
                        properties.getDefaultLengthCm(),
                        "length",
                        new BigDecimal("0.50")
                )
        );

        payload.put(
                "breadth",
                packageValue(
                        request.breadthCm(),
                        properties.getDefaultBreadthCm(),
                        "breadth",
                        new BigDecimal("0.50")
                )
        );

        payload.put(
                "height",
                packageValue(
                        request.heightCm(),
                        properties.getDefaultHeightCm(),
                        "height",
                        new BigDecimal("0.50")
                )
        );

        payload.put(
                "weight",
                packageValue(
                        request.weightKg(),
                        properties.getDefaultWeightKg(),
                        "weight",
                        BigDecimal.ZERO
                )
        );

        return payload;
    }

    private String resolvePickupLocation(
            ShiprocketCreateRequest request
    ) {
        String pickupLocation =
                firstNonBlank(
                        request.pickupLocation(),
                        properties.getPickupLocation(),
                        "warehouse"
                );

        if (
                pickupLocation.equalsIgnoreCase("primary")
        ) {
            return "warehouse";
        }

        return pickupLocation;
    }

    private List<Map<String, Object>> buildOrderItems(
            Order order
    ) {
        return order
                .getItems()
                .stream()
                .map(this::buildOrderItem)
                .toList();
    }

    private Map<String, Object> buildOrderItem(
            OrderItem item
    ) {
        Map<String, Object> payload =
                new LinkedHashMap<>();

        payload.put(
                "name",
                trimMax(
                        required(
                                item.getProductTitle(),
                                "Product title"
                        ),
                        200
                )
        );

        payload.put(
                "sku",
                item.getProduct() != null
                        && item.getProduct().getId() != null
                        ? "PROD-" + item.getProduct().getId()
                        : "ITEM-" + item.getId()
        );

        payload.put(
                "units",
                item.getQuantity()
        );

        payload.put(
                "selling_price",
                rupees(item.getUnitPrice())
        );

        return payload;
    }

    private ShiprocketOrderResponse map(
            ShiprocketOrder shiprocketOrder
    ) {
        Order order =
                shiprocketOrder.getOrder();

        Long orderId =
                order != null
                        ? order.getId()
                        : null;

        String orderNumber =
                order != null
                        ? order.getOrderNumber()
                        : null;

        JsonNode responseJson =
                parseJsonOrNull(
                        shiprocketOrder.getResponseJson()
                );

        return new ShiprocketOrderResponse(
                shiprocketOrder.getId(),
                orderId,
                orderNumber,
                shiprocketOrder.getShiprocketOrderId(),
                shiprocketOrder.getShiprocketShipmentId(),
                shiprocketOrder.getAwbCode(),
                shiprocketOrder.getCourierName(),
                shiprocketOrder.getCourierCompanyId(),
                shiprocketOrder.getTrackingUrl(),
                shiprocketOrder.getStatus(),
                extractTrackingStatus(responseJson),
                extractTrackingLocation(responseJson),
                extractTrackingActivity(responseJson),
                shiprocketOrder.getCreatedAt(),
                shiprocketOrder.getUpdatedAt(),
                null,
                null,
                null,
                null
        );
    }

    private String safeOrderReference(
            Order order
    ) {
        String value =
                firstNonBlank(
                        order.getOrderNumber(),
                        "ORDER-" + order.getId()
                );

        return trimMax(
                value,
                50
        );
    }

    private String buildTrackingUrl(
            String awbCode
    ) {
        String base =
                properties.getTrackingBaseUrl();

        if (isBlank(base)) {
            return null;
        }

        base =
                base.trim();

        if (base.endsWith("/")) {
            return base + awbCode;
        }

        return base + "/" + awbCode;
    }

    private int rupees(
            BigDecimal value
    ) {
        if (value == null) {
            return 0;
        }

        return value
                .setScale(0, RoundingMode.HALF_UP)
                .intValue();
    }

    private BigDecimal packageValue(
            BigDecimal requestValue,
            BigDecimal defaultValue,
            String fieldName,
            BigDecimal minExclusive
    ) {
        BigDecimal value =
                requestValue != null
                        ? requestValue
                        : defaultValue;

        if (value == null) {
            throw new RuntimeException(
                    "Package " + fieldName + " is missing"
            );
        }

        if (value.compareTo(minExclusive) <= 0) {
            throw new RuntimeException(
                    "Package "
                            + fieldName
                            + " must be greater than "
                            + minExclusive
            );
        }

        return value;
    }

    private String normalizeIndianPhone(
            String value
    ) {
        String digits =
                onlyDigits(value);

        if (digits.length() > 10) {
            digits =
                    digits.substring(
                            digits.length() - 10
                    );
        }

        if (digits.length() != 10) {
            throw new RuntimeException(
                    "Phone number must contain 10 digits"
            );
        }

        return digits;
    }

    private String onlyDigits(
            String value
    ) {
        return value
                .replaceAll("[^0-9]", "");
    }

    private String required(
            String value,
            String fieldName
    ) {
        if (isBlank(value)) {
            throw new RuntimeException(
                    fieldName + " is required"
            );
        }

        return value.trim();
    }

    private String trimMax(
            String value,
            int max
    ) {
        if (value == null) {
            return null;
        }

        String trimmed =
                value.trim();

        if (trimmed.length() <= max) {
            return trimmed;
        }

        return trimmed.substring(0, max);
    }

    private String firstNonBlank(
            String... values
    ) {
        if (values == null) {
            return null;
        }

        for (String value : values) {
            if (!isBlank(value)) {
                return value.trim();
            }
        }

        return null;
    }

    private boolean isBlank(
            String value
    ) {
        return value == null
                || value.isBlank();
    }

    private String safeStatus(
            String value,
            String fallback
    ) {
        return trimMax(
                firstNonBlank(
                        value,
                        fallback
                ),
                80
        );
    }

    private Long extractShiprocketOrderId(
            JsonNode response
    ) {
        return findLongAny(
                response,
                "order_id",
                "shiprocket_order_id"
        );
    }

    private Long extractShipmentId(
            JsonNode response
    ) {
        Long direct =
                findLongAny(
                        response,
                        "shipment_id",
                        "shiprocket_shipment_id",
                        "shipmentId"
                );

        if (direct != null) {
            return direct;
        }

        JsonNode shipmentNode =
                findNode(
                        response,
                        "shipment"
                );

        if (shipmentNode != null) {
            Long fromShipment =
                    findLongAny(
                            shipmentNode,
                            "id",
                            "shipment_id",
                            "shipmentId"
                    );

            if (fromShipment != null) {
                return fromShipment;
            }
        }

        JsonNode shipmentsNode =
                findNode(
                        response,
                        "shipments"
                );

        if (
                shipmentsNode != null
                        && shipmentsNode.isArray()
                        && shipmentsNode.size() > 0
        ) {
            return findLongAny(
                    shipmentsNode.get(0),
                    "id",
                    "shipment_id",
                    "shipmentId"
            );
        }

        return null;
    }

    private String extractTrackingStatus(
            JsonNode payload
    ) {
        return firstNonBlank(
                findTextAny(
                        payload,
                        "current_status",
                        "shipment_status",
                        "shipment_track_status",
                        "tracking_status",
                        "track_status",
                        "activity"
                ),
                findTextAny(
                        payload,
                        "status",
                        "message"
                )
        );
    }

    private String extractTrackingLocation(
            JsonNode payload
    ) {
        return findTextAny(
                payload,
                "location",
                "current_location",
                "scan_location",
                "city"
        );
    }

    private String extractTrackingActivity(
            JsonNode payload
    ) {
        return findTextAny(
                payload,
                "activity",
                "status_description",
                "description",
                "remark",
                "remarks",
                "message"
        );
    }

    private Long findLongAny(
            JsonNode root,
            String... fieldNames
    ) {
        if (fieldNames == null) {
            return null;
        }

        for (String fieldName : fieldNames) {
            Long value =
                    findLong(
                            root,
                            fieldName
                    );

            if (value != null) {
                return value;
            }
        }

        return null;
    }

    private String findTextAny(
            JsonNode root,
            String... fieldNames
    ) {
        if (fieldNames == null) {
            return null;
        }

        for (String fieldName : fieldNames) {
            String value =
                    findText(
                            root,
                            fieldName
                    );

            if (!isBlank(value)) {
                return value;
            }
        }

        return null;
    }

    private Long findLong(
            JsonNode root,
            String fieldName
    ) {
        String text =
                findText(
                        root,
                        fieldName
                );

        if (isBlank(text)) {
            return null;
        }

        try {
            return Long.valueOf(text);

        } catch (NumberFormatException exception) {
            return null;
        }
    }

    private String findDirectText(
            JsonNode root,
            String fieldName
    ) {
        if (
                root == null
                        || fieldName == null
                        || !root.isObject()
                        || !root.hasNonNull(fieldName)
        ) {
            return null;
        }

        return root
                .get(fieldName)
                .asText();
    }

    private String findText(
            JsonNode root,
            String fieldName
    ) {
        if (
                root == null
                        || fieldName == null
        ) {
            return null;
        }

        if (
                root.isObject()
                        && root.hasNonNull(fieldName)
        ) {
            return root
                    .get(fieldName)
                    .asText();
        }

        if (root.isObject()) {
            Iterator<JsonNode> children =
                    root.elements();

            while (children.hasNext()) {
                String value =
                        findText(
                                children.next(),
                                fieldName
                        );

                if (!isBlank(value)) {
                    return value;
                }
            }
        }

        if (root.isArray()) {
            for (JsonNode child : root) {
                String value =
                        findText(
                                child,
                                fieldName
                        );

                if (!isBlank(value)) {
                    return value;
                }
            }
        }

        return null;
    }

    private JsonNode findNode(
            JsonNode root,
            String fieldName
    ) {
        if (
                root == null
                        || fieldName == null
        ) {
            return null;
        }

        if (
                root.isObject()
                        && root.hasNonNull(fieldName)
        ) {
            return root.get(fieldName);
        }

        if (root.isObject()) {
            Iterator<JsonNode> children =
                    root.elements();

            while (children.hasNext()) {
                JsonNode found =
                        findNode(
                                children.next(),
                                fieldName
                        );

                if (found != null) {
                    return found;
                }
            }
        }

        if (root.isArray()) {
            for (JsonNode child : root) {
                JsonNode found =
                        findNode(
                                child,
                                fieldName
                        );

                if (found != null) {
                    return found;
                }
            }
        }

        return null;
    }

    private JsonNode parseJsonOrNull(
            String json
    ) {
        if (isBlank(json)) {
            return null;
        }

        try {
            return objectMapper.readTree(json);

        } catch (Exception exception) {
            return null;
        }
    }

    private String toJson(
            Object value
    ) {
        try {
            return objectMapper
                    .writeValueAsString(value);

        } catch (Exception exception) {
            return String.valueOf(value);
        }
    }

    private String mergeResponseJson(
            String existingJson,
            String key,
            JsonNode response
    ) {
        Map<String, Object> merged =
                new LinkedHashMap<>();

        if (!isBlank(existingJson)) {
            merged.put(
                    "previous",
                    existingJson
            );
        }

        merged.put(
                key,
                response
        );

        return toJson(merged);
    }
}