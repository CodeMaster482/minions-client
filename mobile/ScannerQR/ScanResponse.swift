import Foundation

struct ScanResponse: Codable {
    let zone: String?
    let urlGeneralInfo: UrlGeneralInfo?
    let urlDomainWhoIs: UrlDomainWhoIs?
    let ipGeneralInfo: IpGeneralInfo?
    let domainGeneralInfo: DomainGeneralInfo?

    enum CodingKeys: String, CodingKey {
        case zone = "Zone"
        case urlGeneralInfo = "UrlGeneralInfo"
        case urlDomainWhoIs = "UrlDomainWhoIs"
        case ipGeneralInfo = "IpGeneralInfo"
        case domainGeneralInfo = "DomainGeneralInfo"
    }
}

struct UrlGeneralInfo: Codable {
    let url: String
    let host: String
    let ipv4Count: Int
    let filesCount: Int
    let categories: [String]
    let categoriesWithZone: [CategoryWithZone]

    enum CodingKeys: String, CodingKey {
        case url = "Url"
        case host = "Host"
        case ipv4Count = "Ipv4Count"
        case filesCount = "FilesCount"
        case categories = "Categories"
        case categoriesWithZone = "CategoriesWithZone"
    }
}

struct CategoryWithZone: Codable {
    let name: String
    let zone: String

    enum CodingKeys: String, CodingKey {
        case name = "Name"
        case zone = "Zone"
    }
}

struct UrlDomainWhoIs: Codable {
    let domainName: String
    let created: String
    let updated: String
    let expires: String
    let nameServers: [String]
    let contacts: [Contact]
    let registrar: Registrar
    let domainStatus: [String]
    let registrationOrganization: String

    enum CodingKeys: String, CodingKey {
        case domainName = "DomainName"
        case created = "Created"
        case updated = "Updated"
        case expires = "Expires"
        case nameServers = "NameServers"
        case contacts = "Contacts"
        case registrar = "Registrar"
        case domainStatus = "DomainStatus"
        case registrationOrganization = "RegistrationOrganization"
    }
}

struct Contact: Codable {
    let contactType: String
    let organization: String

    enum CodingKeys: String, CodingKey {
        case contactType = "ContactType"
        case organization = "Organization"
    }
}

struct Registrar: Codable {
    let info: String
    let ianaId: String

    enum CodingKeys: String, CodingKey {
        case info = "Info"
        case ianaId = "IanaId"
    }
}

struct IpGeneralInfo: Codable {
    let ip: String
    let categories: [String]
    let countryCode: String

    enum CodingKeys: String, CodingKey {
        case ip = "Ip"
        case categories = "Categories"
        case countryCode = "CountryCode"
    }
}

struct DomainGeneralInfo: Codable {
    let domain: String
    let categories: [String]
    let filesCount: Int
    let ipv4Count: Int
    let hitsCount: Int

    enum CodingKeys: String, CodingKey {
        case domain = "Domain"
        case categories = "Categories"
        case filesCount = "FilesCount"
        case ipv4Count = "Ipv4Count"
        case hitsCount = "HitsCount"
    }
}

struct ScreenScanResponse: Codable {
    let results: [String: ScanResponse]

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: DynamicCodingKeys.self)
        var tempResults = [String: ScanResponse]()

        for key in container.allKeys {
            let scanResponse = try container.decode(ScanResponse.self, forKey: key)
            tempResults[key.stringValue] = scanResponse
        }

        self.results = tempResults
    }
}

struct DynamicCodingKeys: CodingKey {
    var stringValue: String
    var intValue: Int?

    init?(stringValue: String) { self.stringValue = stringValue }
    init?(intValue: Int) { self.intValue = intValue; self.stringValue = "\(intValue)" }
}
